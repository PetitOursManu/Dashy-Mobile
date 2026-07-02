import { useMemo } from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Radius, Shadows, Typography } from './tokens';
import { useColors } from './ThemeContext';
import { ColorPalette } from './colors';

export const glassCard = (Colors: ColorPalette): ViewStyle => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: Radius.xl,
  borderTopWidth: 1,
  borderLeftWidth: 1,
  borderTopColor: 'rgba(255, 255, 255, 0.6)',
  borderLeftColor: 'rgba(255, 255, 255, 0.6)',
  ...Shadows.ambientCard,
});

export const primaryButton = (Colors: ColorPalette): ViewStyle => ({
  backgroundColor: Colors.primary,
  borderRadius: Radius.md,
  paddingHorizontal: 24,
  paddingVertical: 12,
  alignItems: 'center',
  justifyContent: 'center',
  ...Shadows.primaryGlow,
});

export const primaryButtonText = (Colors: ColorPalette): TextStyle => ({
  ...Typography.bodyBold,
  color: Colors.onPrimary,
});

export const secondaryButton = (Colors: ColorPalette): ViewStyle => ({
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  borderRadius: Radius.md,
  borderWidth: 1,
  borderColor: 'rgba(224, 192, 180, 0.5)',
  paddingHorizontal: 16,
  paddingVertical: 10,
  alignItems: 'center',
  justifyContent: 'center',
});

export const secondaryButtonText = (Colors: ColorPalette): TextStyle => ({
  ...Typography.bodyBold,
  color: Colors.onSurface,
});

export const input = (Colors: ColorPalette): ViewStyle => ({
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  borderRadius: Radius.md,
  borderWidth: 1,
  borderColor: Colors.surfaceVariant,
  paddingHorizontal: 16,
  paddingVertical: 12,
  color: Colors.onSurface,
  ...Typography.bodyBase,
});

export const pill: ViewStyle = {
  borderRadius: Radius.full,
  paddingHorizontal: 12,
  paddingVertical: 4,
};

const getCommonStyles = (Colors: ColorPalette) => StyleSheet.create({
  glassCard: glassCard(Colors),
  primaryButton: primaryButton(Colors),
  primaryButtonText: primaryButtonText(Colors),
  secondaryButton: secondaryButton(Colors),
  secondaryButtonText: secondaryButtonText(Colors),
  input: input(Colors),
  pill,
  sectionTitle: {
    ...Typography.headlineSection,
    color: Colors.onSurface,
  } as TextStyle,
  pageTitle: {
    ...Typography.headlinePageMobile,
    color: Colors.onSurface,
  } as TextStyle,
  body: {
    ...Typography.bodyBase,
    color: Colors.onSurfaceVariant,
  } as TextStyle,
  labelCaps: {
    ...Typography.labelCaps,
    color: Colors.outline,
  } as TextStyle,
  metadata: {
    ...Typography.metadata,
    color: Colors.onSurfaceVariant,
  } as TextStyle,
  activeNavItem: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.md,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  } as ViewStyle,
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    ...Shadows.bottomNav,
  } as ViewStyle,
});

export const useCommonStyles = () => {
  const Colors = useColors();
  return useMemo(() => getCommonStyles(Colors), [Colors]);
};
