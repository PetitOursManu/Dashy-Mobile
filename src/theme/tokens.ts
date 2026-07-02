import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { LightColors } from './colors';

/**
 * Static light palette kept for backwards compatibility.
 * Prefer `useColors()` from `./ThemeContext` for dynamic theming.
 */
export const Colors = LightColors;

export type ColorToken = keyof typeof Colors;

export const Radius = {
  sm: 4,
  default: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Spacing = {
  baseUnit: 4,
  gutter: 20,
  marginMobile: 16,
  marginDesktop: 32,
  containerPadding: 20,
} as const;

export const Typography = {
  displayLg: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.32,
  } as TextStyle,
  headlinePage: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.26,
  } as TextStyle,
  headlinePageMobile: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.22,
  } as TextStyle,
  headlineSection: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.18,
  } as TextStyle,
  bodyBase: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  } as TextStyle,
  bodyBold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  } as TextStyle,
  labelCaps: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.55,
    textTransform: 'uppercase',
  } as TextStyle,
  metadata: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0,
  } as TextStyle,
} as const;

export type TypographyToken = keyof typeof Typography;

export const Shadows = {
  ambientCard: {
    shadowColor: 'rgba(95, 60, 35, 0.22)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 4,
  } as ViewStyle,
  ambientSoft: {
    shadowColor: 'rgba(95, 60, 35, 0.22)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 3,
  } as ViewStyle,
  primaryGlow: {
    shadowColor: 'rgba(239, 106, 46, 0.35)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  } as ViewStyle,
  bottomNav: {
    shadowColor: 'rgba(95, 60, 35, 0.22)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
} as const;

export const GlobalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: Spacing.marginMobile,
  },
  section: {
    marginBottom: Spacing.gutter,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
