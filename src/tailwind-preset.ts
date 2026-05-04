/**
 * Chinweike Tailwind Preset
 *
 * Each platform's tailwind.config.{ts,js} does:
 *
 *   import chinweikePreset from '@chinweike/shared-ui/tailwind-preset';
 *   export default {
 *     presets: [chinweikePreset],
 *     content: [...],
 *   };
 *
 * No platform should ever override brand colors. If a new shade is needed,
 * add it here so every surface stays in sync.
 */

import type { Config } from 'tailwindcss';
import { colors, typography, radius, shadows, motion, breakpoints } from './tokens';

const preset: Partial<Config> = {
  theme: {
    screens: breakpoints,
    extend: {
      colors: {
        // Brand
        navy:        colors.navy,
        'navy-deep': colors.navyDeep,
        'navy-soft': colors.navySoft,
        forest:      colors.forest,
        'forest-soft': colors.forestSoft,
        gold:        colors.gold,
        'gold-glow': colors.goldGlow,
        'gold-soft': colors.goldSoft,
        'gold-dim':  colors.goldDim,
        cream:       colors.cream,
        'cream-dim': colors.creamDim,
        'cream-mute': colors.creamMute,

        // Semantic
        success: colors.success,
        warning: colors.warning,
        danger:  colors.danger,
        info:    colors.info,
      },
      fontFamily: {
        display: typography.fontFamily.display.split(',').map(s => s.trim()),
        body:    typography.fontFamily.body.split(',').map(s => s.trim()),
        mono:    typography.fontFamily.mono.split(',').map(s => s.trim()),
        sans:    typography.fontFamily.body.split(',').map(s => s.trim()),
      },
      fontSize: typography.fontSize as unknown as Record<string, [string, { lineHeight: string }]>,
      fontWeight: typography.fontWeight as unknown as Record<string, string>,
      letterSpacing: typography.letterSpacing as unknown as Record<string, string>,
      borderRadius: radius,
      boxShadow: shadows,
      transitionDuration: motion.duration,
      transitionTimingFunction: motion.easing,
      backgroundImage: {
        'gradient-navy': `linear-gradient(180deg, ${colors.navy} 0%, ${colors.navyDeep} 100%)`,
        'gradient-forest': `linear-gradient(180deg, ${colors.forest} 0%, ${colors.navy} 100%)`,
        'gradient-gold': `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldGlow} 100%)`,
      },
    },
  },
  plugins: [],
};

export default preset;
