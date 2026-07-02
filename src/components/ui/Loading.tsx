import React from 'react';
import { View, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { useColors } from '../../theme/ThemeContext';
import { Text } from './Text';

interface Props {
  message?: string;
  style?: StyleProp<ViewStyle>;
}

export const Loading: React.FC<Props> = ({ message, style }) => {
  const Colors = useColors();
  return (
    <View
      style={[
        { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
        style,
      ]}
    >
      <ActivityIndicator size="large" color={Colors.primary} />
      {message && (
        <Text variant="bodyBase" color={Colors.onSurfaceVariant} style={{ marginTop: 12 }}>
          {message}
        </Text>
      )}
    </View>
  );
};
