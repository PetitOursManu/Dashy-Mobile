import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Radius, Typography } from '../../theme/tokens';
import { useColors, useTheme } from '../../theme/ThemeContext';

type Props = TextInputProps & {
  leftIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
};

export const Input: React.FC<Props> = ({
  leftIcon,
  containerStyle,
  inputStyle,
  multiline,
  numberOfLines,
  ...rest
}) => {
  const Colors = useColors();
  const { isGlass } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          backgroundColor: isGlass ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.6)',
          borderRadius: Radius.md,
          borderWidth: 1,
          borderColor: Colors.outlineVariant,
          paddingHorizontal: leftIcon ? 12 : 16,
          paddingVertical: multiline ? 12 : 0,
          minHeight: multiline ? 80 : 48,
        },
        containerStyle,
      ]}
    >
      {leftIcon && <View style={{ marginRight: 8, marginTop: multiline ? 2 : 0 }}>{leftIcon}</View>}
      <RNTextInput
        {...rest}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor={Colors.outline}
        style={[
          {
            flex: 1,
            color: Colors.onSurface,
            ...Typography.bodyBase,
            paddingVertical: 0,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          inputStyle,
        ]}
      />
    </View>
  );
};
