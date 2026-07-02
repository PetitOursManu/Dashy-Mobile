import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Radius, Typography } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'error';

interface Props {
  label: string;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
}

const getVariants = (Colors: ReturnType<typeof useColors>): Record<Variant, { bg: string; text: string; border?: string }> => ({
  primary: { bg: Colors.primaryContainer, text: Colors.onPrimaryContainer },
  secondary: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer },
  tertiary: { bg: Colors.tertiaryContainer, text: Colors.onTertiaryContainer },
  outline: { bg: 'transparent', text: Colors.outline, border: Colors.outlineVariant },
  error: { bg: Colors.errorContainer, text: Colors.error },
});

export const Badge: React.FC<Props> = ({ label, variant = 'secondary', style }) => {
  const Colors = useColors();
  const variants = getVariants(Colors);
  const { bg, text, border } = variants[variant];
  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: bg,
          borderRadius: Radius.full,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderWidth: border ? 1 : 0,
          borderColor: border,
        },
        style,
      ]}
    >
      <Text variant="labelCaps" color={text} style={{ fontSize: 10 }}>{label}</Text>
    </View>
  );
};
