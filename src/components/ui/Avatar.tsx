import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Image } from 'expo-image';
import { Radius, Typography } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { Text } from './Text';

interface Props {
  uri?: string | null;
  initials?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<Props> = ({
  uri,
  initials,
  size = 48,
  style,
}) => {
  const Colors = useColors();
  const fallbackBg = uri ? Colors.surfaceVariant : Colors.secondaryContainer;
  const textColor = uri ? Colors.onSurface : Colors.onSecondaryContainer;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: Radius.full,
          backgroundColor: fallbackBg,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.8)',
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          contentFit="cover"
          transition={200}
        />
      ) : initials ? (
        <Text
          variant="bodyBold"
          color={textColor}
          style={{ fontSize: size * 0.4, lineHeight: size * 0.5 }}
        >
          {initials.toUpperCase()}
        </Text>
      ) : null}
    </View>
  );
};
