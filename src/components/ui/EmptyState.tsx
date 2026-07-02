import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useColors } from '../../theme/ThemeContext';
import { Icon, IconName } from './Icon';
import { Text } from './Text';

interface Props {
  icon?: IconName;
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<Props> = ({
  icon = 'inbox',
  title,
  subtitle,
  style,
}) => {
  const Colors = useColors();
  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          opacity: 0.7,
        },
        style,
      ]}
    >
      <Icon name={icon} size={48} color={Colors.outlineVariant} />
      <Text
        variant="bodyBold"
        color={Colors.onSurfaceVariant}
        style={{ marginTop: 12, textAlign: 'center' }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          variant="bodyBase"
          color={Colors.outline}
          style={{ marginTop: 4, textAlign: 'center' }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};
