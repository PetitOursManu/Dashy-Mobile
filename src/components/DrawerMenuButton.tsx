import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Icon } from './ui/Icon';
import { useColors } from '../theme/ThemeContext';

export const DrawerMenuButton: React.FC = () => {
  const Colors = useColors();
  const navigation = useNavigation();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.button}
      onPress={handlePress}
    >
      <Icon name="menu" size={24} color={Colors.onSurface} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginLeft: -8,
  },
});
