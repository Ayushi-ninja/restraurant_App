/**
 * RestaurantApp — Brand color palette & semantic tokens
 * Primary accent: Deep Orange #FF5A1F
 */

export const palette = {
  // Brand
  orange50: '#FFF3EE',
  orange100: '#FFE4D6',
  orange200: '#FFCAAD',
  orange300: '#FFA37A',
  orange400: '#FF7645',
  orange500: '#FF5A1F', // ← Primary accent
  orange600: '#F03D00',
  orange700: '#C73100',
  orange800: '#A22A00',
  orange900: '#852700',

  // Neutrals (warm-tinted grays)
  neutral0: '#FFFFFF',
  neutral50: '#FAF8F6',
  neutral100: '#F4F0EC',
  neutral200: '#E8E2DA',
  neutral300: '#D4CCc2',
  neutral400: '#B0A898',
  neutral500: '#8C8278',
  neutral600: '#6B6158',
  neutral700: '#4A4239',
  neutral800: '#2E2820',
  neutral900: '#1A1410',

  // Status
  successLight: '#ECFDF5',
  success: '#10B981',
  successDark: '#065F46',

  warningLight: '#FFFBEB',
  warning: '#F59E0B',
  warningDark: '#92400E',

  errorLight: '#FEF2F2',
  error: '#EF4444',
  errorDark: '#991B1B',

  infoLight: '#EFF6FF',
  info: '#3B82F6',
  infoDark: '#1E3A8A',
} as const;

/** Semantic tokens — use these in components, not raw palette values */
export const colors = {
  // Brand
  primary: palette.orange500,
  primaryLight: palette.orange100,
  primaryDark: palette.orange700,

  // Backgrounds
  background: palette.neutral50,
  surface: palette.neutral0,
  surfaceElevated: palette.neutral0,
  surfaceSubtle: palette.neutral100,

  // Text
  textPrimary: palette.neutral900,
  textSecondary: palette.neutral600,
  textTertiary: palette.neutral400,
  textInverse: palette.neutral0,
  textOnPrimary: palette.neutral0,

  // Borders & dividers
  border: palette.neutral200,
  borderStrong: palette.neutral300,
  divider: palette.neutral100,

  // Interactive
  focusRing: palette.orange300,
  tabActive: palette.orange500,
  tabInactive: palette.neutral400,

  // Card / Shadow hint
  cardBackground: palette.neutral0,
  cardBorder: palette.neutral200,

  // Status
  success: palette.success,
  successBackground: palette.successLight,
  warning: palette.warning,
  warningBackground: palette.warningLight,
  error: palette.error,
  errorBackground: palette.errorLight,
  info: palette.info,
  infoBackground: palette.infoLight,

  // Rating star
  star: '#FBBF24',
} as const;

export type ColorKey = keyof typeof colors;
