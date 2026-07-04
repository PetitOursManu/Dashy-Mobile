import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { Radius, Typography } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { Text } from './Text';

interface Props {
  source?: ImageSource | string | null;
  initials?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<Props> = ({
  source,
  initials,
  size = 48,
  style,
}) => {
  const Colors = useColors();
  const hasSource = !!source;
  const fallbackBg = hasSource ? Colors.surfaceVariant : Colors.secondaryContainer;
  const textColor = hasSource ? Colors.onSurface : Colors.onSecondaryContainer;

  const imageSource: ImageSource | undefined = React.useMemo(() => {
    if (!source) return undefined;
    if (typeof source === 'string') return { uri: source };
    return source;
  }, [source]);

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
      {imageSource ? (
        <Image
          source={imageSource}
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
