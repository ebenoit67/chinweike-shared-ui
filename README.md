# @chinweike/shared-ui

The single source of truth for **brand**, **design tokens**, **logo**, and the **Axis Universal Event Contract** across every Chinweike platform.

> **Rule:** Never hardcode brand hex values, fonts, or event shapes anywhere else. Import from here. Always.

---

## Folder layout

```
chinweike-shared-ui/
├── src/
│   ├── index.ts              # barrel export
│   ├── tokens.ts             # colors, typography, radius, motion, brand
│   ├── tailwind-preset.ts    # Tailwind preset every platform extends
│   ├── logo.tsx              # <Logo /> React component
│   └── axis-events.ts        # Universal Event Contract (Zod + emit helper)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Install in another platform

From a Chinweike project (e.g. `chinweike-holding-website`, `rival-technologies-axis`):

**Option 1 — npm/pnpm workspace (recommended):**
Add this repo to your workspace's `package.json`:
```json
{
  "workspaces": ["../chinweike-shared-ui", "."]
}
```
Then in the consuming project:
```bash
npm install @chinweike/shared-ui
```

**Option 2 — file: dependency (simpler, works today):**
```bash
npm install file:../chinweike-shared-ui
```

---

## Usage

### Brand tokens
```ts
import { colors, brand, typography } from '@chinweike/shared-ui';

console.log(colors.gold);        // '#C9A84C'
console.log(brand.tagline);      // 'God Owns Strength'
```

### Tailwind
```ts
// tailwind.config.ts
import preset from '@chinweike/shared-ui/tailwind-preset';
export default {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
};
```
Then in components: `className="bg-navy text-gold border-gold-soft"`.

### Logo
```tsx
import { Logo } from '@chinweike/shared-ui';

<Logo variant="full" theme="gold-on-navy" size={64} showTagline />
<Logo variant="mark" theme="gold-on-cream" size={32} />
```

### Axis events (server-side only)
```ts
import { emitAxisEvent, AxisEventType } from '@chinweike/shared-ui/axis';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

await emitAxisEvent({ supabaseAdmin }, {
  platform: 'rewards_genie',
  source: 'api/cards/add',
  event_type: AxisEventType.REWARDS_CARD_ADDED,
  severity: 'info',
  actor_type: 'user',
  actor_id: userId,
  subject_type: 'card',
  subject_id: cardId,
  payload: { issuer: 'Chase', last4: '4242' },
});
```

---

## Brand guardrails

- **Colors only from `tokens.colors`.** No new hex anywhere else.
- **Fonts only from `tokens.typography.fontFamily`.** Always load via `next/font` or `<link>` from Google Fonts.
- **Tagline:** "God Owns Strength" — uppercase, letter-spaced 0.18em, on every site footer and hero.
- **Founder name:** Eddy Benoit Rival in formal docs; "Benoit" in informal/sign-offs.
- **Logo theme by surface:**
  - Navy bg → `gold-on-navy`
  - Forest bg → `gold-on-forest`
  - Cream bg → `gold-on-cream`
  - Print/mono → `mono-navy` or `mono-cream`

---

## Versioning

This package is `private: true` and version-pinned in each consumer via workspace or `file:` reference. Bump the `version` in `package.json` whenever brand tokens change so downstream platforms can review the diff before adopting.

— *Eddy Benoit Rival, Chinweike Holding LLC*
*God Owns Strength.*
