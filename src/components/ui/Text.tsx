import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { Typography, TypographyToken } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';

type Props = TextProps & {
  variant?: TypographyToken;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  numberOfLines?: number;
  testID?: string;
};

export const Text: React.FC<Props> = ({
  variant = 'bodyBase',
  color,
  align,
  style,
  children,
  numberOfLines,
  ...rest
}) => {
  const Colors = useColors();
  const resolvedColor = color ?? Colors.onSurface;
  const variantStyle: TextStyle = Typography[variant];

  return (
    <RNText
      {...rest}
      numberOfLines={numberOfLines}
      style={[
        variantStyle,
        { color: resolvedColor },
        align ? { textAlign: align } : undefined,
        style,
      ]}
    >
      {children}
    </RNText>
  );
};
