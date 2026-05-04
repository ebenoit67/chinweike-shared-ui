/**
 * Chinweike Brand Tokens — Single Source of Truth
 *
 * Reference: business card.
 * Rule: Every Chinweike platform imports from here. Never hardcode hex values.
 *
 * Brand tagline: "God Owns Strength" (Igbo: Chinweike).
 */

export const colors = {
  // Primary brand
  navy:       '#0A1628',
  forest:     '#1A3A2A',
  gold:       '#C9A84C',
  goldGlow:   '#D4A843',
  cream:      '#F5F0E8',

  // Functional palette (derived, not invented)
  navyDeep:   '#060E1A',  // for darker depths / hover bgs
  navySoft:   '#172238',  // for elevated cards on navy
  forestSoft: '#244A38',  // for elevated cards on forest
  goldSoft:   'rgba(201, 168, 76, 0.15)',  // borders, hover states
  goldDim:    '#9A7E32',  // for disabled gold elements
  creamDim:   '#D8D2C5',  // for secondary body text on dark bgs
  creamMute:  'rgba(245, 240, 232, 0.7)',  // tertiary text

  // Semantic (kept tight — extend only when actually needed)
  success:    '#2D7A4F',  // forest-family
  warning:    '#D4A843',  // gold (reuses brand)
  danger:     '#A8342B',
  info:       '#3B6B8C',
} as const;

export const typography = {
  fontFamily: {
    display: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
    body:    '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
    mono:    '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  },
  fontSize: {
    xs:   ['0.75rem',   { lineHeight: '1rem' }],
    sm:   ['0.875rem',  { lineHeight: '1.25rem' }],
    base: ['1rem',      { lineHeight: '1.5rem' }],
    lg:   ['1.125rem',  { lineHeight: '1.75rem' }],
    xl:   ['1.25rem',   { lineHeight: '1.875rem' }],
    '2xl': ['1.5rem',   { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem',  { lineHeight: '2.5rem' }],
    '5xl': ['3rem',     { lineHeight: '1.1' }],
    '6xl': ['3.75rem',  { lineHeight: '1.05' }],
    '7xl': ['4.5rem',   { lineHeight: '1' }],
  },
  fontWeight: {
    normal:   '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
  },
  letterSpacing: {
    display:  '-0.02em',
    body:     '0',
    tagline:  '0.18em',  // for "God Owns Strength" caps treatment
  },
} as const;

export const radius = {
  none: '0px',
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const shadows = {
  none:  'none',
  sm:    '0 1px 2px rgba(6, 14, 26, 0.10)',
  md:    '0 4px 12px rgba(6, 14, 26, 0.18)',
  lg:    '0 12px 32px rgba(6, 14, 26, 0.28)',
  goldGlow: '0 0 20px rgba(212, 168, 67, 0.35)',
  insetGold: 'inset 0 0 0 1px rgba(201, 168, 76, 0.4)',
} as const;

export const motion = {
  duration: {
    instant: '0ms',
    fast:    '150ms',
    base:    '220ms',
    slow:    '380ms',
    slower:  '600ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    enter:    'cubic-bezier(0, 0, 0.2, 1)',
    exit:     'cubic-bezier(0.4, 0, 1, 1)',
    spring:   'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export const breakpoints = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl': '1536px',
} as const;

export const brand = {
  name:        'Chinweike Holding',
  shortName:   'Chinweike',
  tagline:     'God Owns Strength',
  description: 'Technology and Investments',
  igboMeaning: 'God Owns Strength',
  founder:     'Eddy Benoit Rival',
  signatureName: 'Benoit',
  domains: {
    holding:     'chinweikeholding.com',
    operating:   'rivaltechnologies.com',
    axis:        'axis.chinweikeholding.com',
    status:      'status.chinweikeholding.com',
  },
} as const;
