import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../theme/ThemeContext';
import { Text } from './ui/Text';

interface Props {
  title: string;
  active?: boolean;
  onPress: () => void;
}

export const TabButton: React.FC<Props> = ({ title, active, onPress }) => {
  const Colors = useColors();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: active ? Colors.primaryContainer : 'transparent',
          borderColor: active ? Colors.primaryContainer : Colors.outlineVariant,
        },
      ]}
    >
      <Text variant="bodyBold" color={active ? Colors.onPrimaryContainer : Colors.onSurface}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 8,
  },
});
