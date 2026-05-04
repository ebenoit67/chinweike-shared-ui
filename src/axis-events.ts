/**
 * Axis Universal Event Contract — TypeScript + Zod
 *
 * Every Chinweike platform imports this and validates events BEFORE writing
 * to Supabase. Database is the source of truth; this file mirrors it exactly.
 *
 * Usage:
 *   import { AxisEventInput, emitAxisEvent } from '@chinweike/shared-ui/axis';
 *   await emitAxisEvent({ platform: 'rewards_genie', event_type: 'card.added', ... });
 */

import { z } from 'zod';

// ---------- Enums (must match SQL enums exactly) ----------

export const Platform = z.enum([
  'chinweike_holding',
  'rival_technologies',
  'cityguide',
  'eabot',
  'rewards_genie',
  'genie_card_optimizer',
  'wealth_building_training',
  'leadaxis',
  'cyber_guardian',
  'healthy_alchemist',
]);
export type Platform = z.infer<typeof Platform>;

export const Severity = z.enum([
  'debug', 'info', 'warn', 'error', 'critical', 'fatal',
]);
export type Severity = z.infer<typeof Severity>;

export const ApprovalStatus = z.enum([
  'not_required', 'pending', 'approved', 'denied', 'auto_approved', 'expired',
]);
export type ApprovalStatus = z.infer<typeof ApprovalStatus>;

export const ActorType = z.enum([
  'user', 'admin', 'system', 'webhook', 'cron', 'ai_agent',
]);
export type ActorType = z.infer<typeof ActorType>;

export const ApprovalChannel = z.enum(['sms', 'email', 'axis_ui', 'api']);
export type ApprovalChannel = z.infer<typeof ApprovalChannel>;

// ---------- Event input (what platforms emit) ----------

export const AxisEventInput = z.object({
  platform: Platform,
  source: z.string().min(1).max(200),
  environment: z.enum(['development', 'staging', 'production'])
    .default('production'),

  event_type: z.string()
    .regex(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/,
      'event_type must be dot.notation, lowercase, e.g. "user.signup"'),
  severity: Severity.default('info'),

  actor_type: ActorType.default('system'),
  actor_id: z.string().max(200).optional().nullable(),
  actor_email: z.string().email().optional().nullable(),

  subject_type: z.string().max(100).optional().nullable(),
  subject_id: z.string().max(200).optional().nullable(),

  requires_approval: z.boolean().default(false),
  approval_expires_at: z.string().datetime({ offset: true }).optional().nullable(),

  notify_owner_sms: z.boolean().default(false),
  notify_owner_email: z.boolean().default(false),

  payload: z.record(z.unknown()).default({}),

  correlation_id: z.string().uuid().optional().nullable(),
  parent_event_id: z.string().uuid().optional().nullable(),

  client_ip: z.string().optional().nullable(),
  user_agent: z.string().optional().nullable(),
  request_id: z.string().optional().nullable(),

  occurred_at: z.string().datetime({ offset: true }).optional(),
}).superRefine((val, ctx) => {
  // If requires_approval, expiry is mandatory and must be in the future
  if (val.requires_approval) {
    if (!val.approval_expires_at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'approval_expires_at is required when requires_approval=true',
        path: ['approval_expires_at'],
      });
    } else if (new Date(val.approval_expires_at) <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'approval_expires_at must be in the future',
        path: ['approval_expires_at'],
      });
    }
  }
  // fatal severity should always notify owner SMS (Rule 3B)
  if (val.severity === 'fatal' && !val.notify_owner_sms) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'fatal severity events MUST set notify_owner_sms=true (Rule 3B)',
      path: ['notify_owner_sms'],
    });
  }
});
export type AxisEventInput = z.infer<typeof AxisEventInput>;

// ---------- Event row (what comes back from the database) ----------

export const AxisEventRow = AxisEventInput.innerType().extend({
  id: z.string().uuid(),
  approval_status: ApprovalStatus,
  approved_by: z.string().nullable(),
  approved_at: z.string().datetime({ offset: true }).nullable(),
  approval_channel: ApprovalChannel.nullable(),
  approval_notes: z.string().nullable(),
  notification_sent_at: z.string().datetime({ offset: true }).nullable(),
  occurred_at: z.string().datetime({ offset: true }),
  created_at: z.string().datetime({ offset: true }),
});
export type AxisEventRow = z.infer<typeof AxisEventRow>;

// ---------- Emit helper ----------

export interface EmitDeps {
  /** Supabase service-role client (server-side only). */
  supabaseAdmin: {
    schema: (s: string) => {
      from: (t: string) => {
        insert: (row: unknown) => Promise<{ data: unknown; error: unknown }>;
      };
    };
  };
}

/**
 * Validates and writes an event to axis.events.
 * MUST be called from a server context (uses service-role client).
 *
 * Throws if validation fails — never silently swallow event errors.
 */
export async function emitAxisEvent(
  deps: EmitDeps,
  input: AxisEventInput,
): Promise<void> {
  const validated = AxisEventInput.parse(input);

  const row: Record<string, unknown> = { ...validated };
  if (validated.requires_approval) {
    row.approval_status = 'pending';
  }

  const { error } = await deps.supabaseAdmin
    .schema('axis')
    .from('events')
    .insert(row);

  if (error) {
    // Re-throw with context — observability is non-negotiable
    throw new Error(
      `[axis] emit failed for ${validated.platform}/${validated.event_type}: ${
        error instanceof Error ? error.message : JSON.stringify(error)
      }`,
    );
  }
}

// ---------- Common event-type constants (autocomplete + typo prevention) ----------

export const AxisEventType = {
  // Lifecycle
  PLATFORM_BOOT: 'platform.boot',
  PLATFORM_SHUTDOWN: 'platform.shutdown',
  PLATFORM_HEALTH_CHECK: 'platform.health_check',

  // User
  USER_SIGNUP: 'user.signup',
  USER_LOGIN: 'user.login',
  USER_LOGIN_FAILED: 'user.login_failed',
  USER_DELETED: 'user.deleted',

  // Payment
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUND_REQUESTED: 'payment.refund_requested',
  PAYMENT_REFUND_PROCESSED: 'payment.refund_processed',

  // Admin actions (always require_approval candidates)
  ADMIN_REFUND_REQUESTED: 'admin.refund_requested',
  ADMIN_USER_BAN_REQUESTED: 'admin.user_ban_requested',
  ADMIN_DEPLOY_REQUESTED: 'admin.deploy_requested',

  // Trading (EA BOT)
  TRADING_POSITION_OPENED: 'trading.position_opened',
  TRADING_POSITION_CLOSED: 'trading.position_closed',
  TRADING_KILL_SWITCH_TRIGGERED: 'trading.kill_switch_triggered',
  TRADING_PNL_HALT: 'trading.pnl_halt',

  // CityGuide
  CITYGUIDE_VENUE_FLAGGED: 'cityguide.venue_flagged',
  CITYGUIDE_REN_ERROR: 'cityguide.ren_error',

  // Genie / Rewards
  REWARDS_CARD_ADDED: 'rewards.card_added',
  REWARDS_RECOMMENDATION_SHOWN: 'rewards.recommendation_shown',

  // Security
  SECURITY_RATE_LIMIT_HIT: 'security.rate_limit_hit',
  SECURITY_SUSPICIOUS_LOGIN: 'security.suspicious_login',
} as const;
