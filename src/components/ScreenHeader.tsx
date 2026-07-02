import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { DrawerMenuButton } from './DrawerMenuButton';
import { Text } from './ui/Text';
import { Spacing } from '../theme/tokens';

interface Props {
  title: string;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ScreenHeader: React.FC<Props> = ({ title, right, style }) => {
  return (
    <View style={[styles.header, style]}>
      <DrawerMenuButton />
      <Text variant="headlinePage" style={styles.title}>
        {title}
      </Text>
      {right ? (
        <View style={styles.right}>
          {right}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 48,
  },
  title: {
    flex: 1,
    marginLeft: 8,
  },
  right: {
    flexShrink: 1,
    alignItems: 'flex-end',
  },
});
