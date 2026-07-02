export interface ColorPalette {
  surface: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  surfaceVariant: string;
  background: string;
  onSurface: string;
  onSurfaceVariant: string;
  onBackground: string;
  inverseSurface: string;
  inverseOnSurface: string;

  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  surfaceTint: string;
  inversePrimary: string;
  primaryFixed: string;
  primaryFixedDim: string;
  onPrimaryFixed: string;
  onPrimaryFixedVariant: string;

  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  secondaryFixed: string;
  secondaryFixedDim: string;
  onSecondaryFixed: string;
  onSecondaryFixedVariant: string;

  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  tertiaryFixed: string;
  tertiaryFixedDim: string;
  onTertiaryFixed: string;
  onTertiaryFixedVariant: string;

  outline: string;
  outlineVariant: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  success: string;
}

export type ThemeName = 'light' | 'dark' | 'violet' | 'glass';

export const LightColors: ColorPalette = {
  surface: '#fcf9f5',
  surfaceDim: '#dcdad6',
  surfaceBright: '#fcf9f5',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f6f3ef',
  surfaceContainer: '#f0ede9',
  surfaceContainerHigh: '#eae8e4',
  surfaceContainerHighest: '#e5e2de',
  surfaceVariant: '#e5e2de',
  background: '#fcf9f5',
  onSurface: '#1c1c1a',
  onSurfaceVariant: '#584239',
  onBackground: '#1c1c1a',
  inverseSurface: '#31302e',
  inverseOnSurface: '#f3f0ec',

  primary: '#a63b00',
  onPrimary: '#ffffff',
  primaryContainer: '#ef6a2e',
  onPrimaryContainer: '#511900',
  surfaceTint: '#a63b00',
  inversePrimary: '#ffb599',
  primaryFixed: '#ffdbce',
  primaryFixedDim: '#ffb599',
  onPrimaryFixed: '#370e00',
  onPrimaryFixedVariant: '#7f2b00',

  secondary: '#6c5b4e',
  onSecondary: '#ffffff',
  secondaryContainer: '#f3dbcb',
  onSecondaryContainer: '#715f52',
  secondaryFixed: '#f6dece',
  secondaryFixedDim: '#d9c2b3',
  onSecondaryFixed: '#25190f',
  onSecondaryFixedVariant: '#534438',

  tertiary: '#6c5b4e',
  onTertiary: '#ffffff',
  tertiaryContainer: '#a38f80',
  onTertiaryContainer: '#36291e',
  tertiaryFixed: '#f6decd',
  tertiaryFixedDim: '#d9c2b2',
  onTertiaryFixed: '#25190f',
  onTertiaryFixedVariant: '#534438',

  outline: '#8c7167',
  outlineVariant: '#e0c0b4',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  success: '#059669',
};

export const DarkColors: ColorPalette = {
  surface: '#262626',
  surfaceDim: '#171717',
  surfaceBright: '#333333',
  surfaceContainerLowest: '#171717',
  surfaceContainerLow: '#1f1f1f',
  surfaceContainer: '#262626',
  surfaceContainerHigh: '#303030',
  surfaceContainerHighest: '#3a3a3a',
  surfaceVariant: '#303030',
  background: '#171717',
  onSurface: '#f4f4f5',
  onSurfaceVariant: '#a1a1aa',
  onBackground: '#f4f4f5',
  inverseSurface: '#f4f4f5',
  inverseOnSurface: '#171717',

  primary: '#fb923c',
  onPrimary: '#2a1205',
  primaryContainer: '#c2410c',
  onPrimaryContainer: '#ffedd5',
  surfaceTint: '#fb923c',
  inversePrimary: '#c2410c',
  primaryFixed: '#7c2d12',
  primaryFixedDim: '#9a3412',
  onPrimaryFixed: '#ffedd5',
  onPrimaryFixedVariant: '#fdba74',

  secondary: '#d4d4d8',
  onSecondary: '#18181b',
  secondaryContainer: '#3f3f46',
  onSecondaryContainer: '#e4e4e7',
  secondaryFixed: '#3f3f46',
  secondaryFixedDim: '#52525b',
  onSecondaryFixed: '#e4e4e7',
  onSecondaryFixedVariant: '#d4d4d8',

  tertiary: '#d4d4d8',
  onTertiary: '#18181b',
  tertiaryContainer: '#3f3f46',
  onTertiaryContainer: '#e4e4e7',
  tertiaryFixed: '#3f3f46',
  tertiaryFixedDim: '#52525b',
  onTertiaryFixed: '#e4e4e7',
  onTertiaryFixedVariant: '#d4d4d8',

  outline: '#71717a',
  outlineVariant: '#3f3f46',
  error: '#f87171',
  onError: '#450a0a',
  errorContainer: '#991b1b',
  onErrorContainer: '#fee2e2',

  success: '#34d399',
};

export const VioletColors: ColorPalette = {
  surface: '#f8f5fb',
  surfaceDim: '#e0dceb',
  surfaceBright: '#f8f5fb',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f3eff7',
  surfaceContainer: '#ede8f3',
  surfaceContainerHigh: '#e7e2ee',
  surfaceContainerHighest: '#e1dbe9',
  surfaceVariant: '#e1dbe9',
  background: '#f8f5fb',
  onSurface: '#1c1b20',
  onSurfaceVariant: '#5d5667',
  onBackground: '#1c1b20',
  inverseSurface: '#312f38',
  inverseOnSurface: '#f5f2fa',

  primary: '#6b4ce6',
  onPrimary: '#ffffff',
  primaryContainer: '#a78bfa',
  onPrimaryContainer: '#2a0061',
  surfaceTint: '#6b4ce6',
  inversePrimary: '#c4b5fd',
  primaryFixed: '#eaddff',
  primaryFixedDim: '#c4b5fd',
  onPrimaryFixed: '#21005d',
  onPrimaryFixedVariant: '#5a3ec7',

  secondary: '#7c6f91',
  onSecondary: '#ffffff',
  secondaryContainer: '#eaddff',
  onSecondaryContainer: '#332d40',
  secondaryFixed: '#eaddff',
  secondaryFixedDim: '#d0bcff',
  onSecondaryFixed: '#1d192b',
  onSecondaryFixedVariant: '#635b77',

  tertiary: '#8b7b9c',
  onTertiary: '#ffffff',
  tertiaryContainer: '#f3e5f5',
  onTertiaryContainer: '#3b2d45',
  tertiaryFixed: '#f3e5f5',
  tertiaryFixedDim: '#e1bee7',
  onTertiaryFixed: '#251629',
  onTertiaryFixedVariant: '#6a5b78',

  outline: '#8b7b9c',
  outlineVariant: '#d8cceb',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  success: '#10b981',
};

export const GlassColors: ColorPalette = {
  ...LightColors,
};

export const themes: Record<ThemeName, ColorPalette> = {
  light: LightColors,
  dark: DarkColors,
  violet: VioletColors,
  glass: GlassColors,
};
