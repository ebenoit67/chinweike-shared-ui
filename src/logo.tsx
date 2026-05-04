import * as React from 'react';
import { colors, brand } from './tokens';

export type LogoVariant = 'full' | 'mark' | 'wordmark';
export type LogoTheme = 'gold-on-navy' | 'gold-on-forest' | 'gold-on-cream' | 'mono-cream' | 'mono-navy';

export interface LogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  size?: number;            // height in px; width is derived
  showTagline?: boolean;
  ariaLabel?: string;
  className?: string;
}

/**
 * Chinweike Holding logo: hands cradling a globe, with wordmark and tagline.
 *
 * This is a vector placeholder rendition matching the business card geometry.
 * Replace the `<HandsAndGlobeMark />` SVG with the production asset when ready —
 * the API surface stays identical so no platform code has to change.
 */
export function Logo({
  variant = 'full',
  theme = 'gold-on-navy',
  size = 56,
  showTagline = true,
  ariaLabel,
  className,
}: LogoProps) {
  const palette = themePalettes[theme];
  const label =
    ariaLabel ??
    `${brand.name}${showTagline ? ` — ${brand.tagline}` : ''}`;

  if (variant === 'mark') {
    return (
      <span
        className={className}
        role="img"
        aria-label={label}
        style={{ display: 'inline-block', height: size, width: size }}
      >
        <HandsAndGlobeMark color={palette.mark} size={size} />
      </span>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span
        className={className}
        role="img"
        aria-label={label}
        style={{ color: palette.text, fontFamily: 'Cormorant Garamond, Georgia, serif' }}
      >
        <Wordmark size={size} color={palette.text} />
        {showTagline && (
          <Tagline size={size * 0.28} color={palette.tagline} />
        )}
      </span>
    );
  }

  return (
    <span
      className={className}
      role="img"
      aria-label={label}
      style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.25 }}
    >
      <HandsAndGlobeMark color={palette.mark} size={size} />
      <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1 }}>
        <Wordmark size={size} color={palette.text} />
        {showTagline && (
          <Tagline size={size * 0.22} color={palette.tagline} />
        )}
      </span>
    </span>
  );
}

// ----- Sub-components -----

const HandsAndGlobeMark: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Globe */}
    <circle cx="50" cy="44" r="20" fill="none" stroke={color} strokeWidth="2.2" />
    <ellipse cx="50" cy="44" rx="20" ry="8" fill="none" stroke={color} strokeWidth="1.6" />
    <line x1="50" y1="24" x2="50" y2="64" stroke={color} strokeWidth="1.6" />
    <path d="M30 44 Q50 38 70 44" fill="none" stroke={color} strokeWidth="1.4" opacity="0.85" />
    <path d="M30 44 Q50 50 70 44" fill="none" stroke={color} strokeWidth="1.4" opacity="0.85" />

    {/* Hands cradling */}
    <path
      d="M18 70 Q22 58 32 60 L40 66 Q44 70 50 70 Q56 70 60 66 L68 60 Q78 58 82 70 L82 80 Q70 86 50 86 Q30 86 18 80 Z"
      fill={color}
      opacity="0.92"
    />
    <path
      d="M22 76 Q34 80 50 80 Q66 80 78 76"
      fill="none"
      stroke={color}
      strokeWidth="0.8"
      opacity="0.4"
    />
  </svg>
);

const Wordmark: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <span
    style={{
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      fontSize: size * 0.5,
      color,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}
  >
    Chinweike <span style={{ fontStyle: 'italic', fontWeight: 500 }}>Holding</span>
  </span>
);

const Tagline: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <span
    style={{
      fontFamily: '"Inter", system-ui, sans-serif',
      fontWeight: 500,
      fontSize: size,
      color,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginTop: size * 0.4,
    }}
  >
    {brand.tagline}
  </span>
);

// ----- Theme palettes -----

const themePalettes: Record<LogoTheme, { mark: string; text: string; tagline: string }> = {
  'gold-on-navy':   { mark: colors.gold,  text: colors.gold,  tagline: colors.creamDim },
  'gold-on-forest': { mark: colors.gold,  text: colors.gold,  tagline: colors.creamDim },
  'gold-on-cream':  { mark: colors.gold,  text: colors.navy,  tagline: colors.forest   },
  'mono-cream':     { mark: colors.cream, text: colors.cream, tagline: colors.creamDim },
  'mono-navy':      { mark: colors.navy,  text: colors.navy,  tagline: colors.forest   },
};
