import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Radius, Spacing } from '../../theme/tokens';
import { User } from '../../types/api';
import { apiGet } from '../../api/client';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useColors } from '../../theme/ThemeContext';

export const UsersScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const navigation = useNavigation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const data = (await apiGet('/api/mobile/v1/users')) as { users: User[] };
      setUsers(data.users ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.failedLoadUsers'));
      setUsers([]);
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return <Loading message={t('admin.loadingUsers')} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={['rgba(246, 222, 205, 0.4)', Colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        <ScreenHeader title={t('admin.users')} />

        {error ? (
          <EmptyState
            icon="people"
            title={t('admin.userManagement')}
            subtitle={t('admin.userManagementSubtitle')}
          />
        ) : users.length === 0 ? (
          <EmptyState icon="people" title={t('admin.noUsers')} subtitle={t('admin.noUsersSubtitle')} />
        ) : (
          users.map((u) => (
            <Card key={u.id} style={styles.card} padding="md">
              <View style={styles.row}>
                <View style={[styles.avatar, { backgroundColor: Colors.surfaceContainerLow }]}>
                  <Text variant="bodyBold" color={Colors.primary}>
                    {(u.nickname || u.email || t('common.user')).slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyBold" color={Colors.onSurface}>{u.nickname || u.email}</Text>
                  <Text variant="metadata" color={Colors.onSurfaceVariant}>{u.email}</Text>
                  <Text variant="metadata" color={Colors.outline} style={{ marginTop: 4 }}>
                    {t('admin.role')}: {u.role}
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.marginMobile,
    paddingBottom: Spacing.gutter,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  card: {
    marginBottom: Spacing.gutter,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});
