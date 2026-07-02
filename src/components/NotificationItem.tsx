import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Notification } from '../types/api';
import { relativeTime } from '../utils/date';
import { Radius, Spacing, Typography } from '../theme/tokens';
import { useColors } from '../theme/ThemeContext';
import { ColorPalette } from '../theme/colors';
import { Card } from './ui/Card';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { useSync } from '../context/SyncContext';

interface Props {
  notification: Notification;
}

export const NotificationItem: React.FC<Props> = ({ notification }) => {
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const { markRead } = useSync();

  const date = relativeTime(notification.createdAt);

  return (
    <PressableCard onPress={() => markRead(notification.id)} style={styles.card} padding="md">
      <View style={styles.row}>
        <View style={styles.icon}>
          <Icon name="notifications" size={22} color={Colors.error} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="bodyBold" color={Colors.onSurface}>
            {notification.message}
          </Text>
          {notification.requestMessage && (
            <Text variant="bodyBase" color={Colors.onSurfaceVariant} style={{ marginTop: 4 }}>
              {notification.requestMessage}
            </Text>
          )}
          <Text variant="metadata" color={Colors.outline} style={{ marginTop: 6 }}>
            {date}
          </Text>
        </View>
      </View>
    </PressableCard>
  );
};

// Inline wrapper to use Card pressable without naming conflict
function PressableCard({ children, onPress, style, padding }: {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  padding?: any;
}) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={style}>
      <Card padding={padding}>{children}</Card>
    </TouchableOpacity>
  );
}

const getStyles = (Colors: ColorPalette) => StyleSheet.create({
  card: {
    marginBottom: Spacing.gutter,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});
