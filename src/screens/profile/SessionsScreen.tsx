import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigation/SettingsStackNavigator';
import { Radius, Spacing } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { SessionInfo } from '../../types/api';
import { getSessions, revokeSession } from '../../api/sessions';
import { useAuth } from '../../context/AuthContext';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { relativeTime } from '../../utils/date';

export const SessionsScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  const route = useRoute();
  const params = (route.params ?? {}) as { returnTo?: string };
  const { logout } = useAuth();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const { sessions: list } = await getSessions();
      setSessions(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('security.failedLoadSessions'));
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleRevoke = async (id: string) => {
    try {
      const { current } = await revokeSession(id);
      if (current) {
        await logout();
        return;
      }
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('security.failedRevokeSession'));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return <Loading message={t('security.loadingSessions')} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
        <View style={styles.header}>
          <Button
            title={t('common.back')}
            variant="ghost"
            size="small"
            onPress={() => {
              if (params.returnTo) {
                if (navigation.canGoBack()) navigation.goBack();
                navigation.getParent()?.navigate(params.returnTo as never);
              } else {
                navigation.goBack();
              }
            }}
          />
          <Text variant="headlinePage" color={Colors.onSurface}>{t('security.devices')}</Text>
          <View style={{ width: 60 }} />
        </View>

        {error && (
          <View style={styles.errorRow}>
            <Icon name="error" size={18} color={Colors.error} />
            <Text variant="bodyBase" color={Colors.error} style={{ marginLeft: 8 }}>
              {error}
            </Text>
          </View>
        )}

        {sessions.length === 0 ? (
          <EmptyState icon="devices" title={t('security.noSessions')} subtitle={t('security.noSessionsSubtitle')} />
        ) : (
          sessions.map((session) => (
            <Card key={session.id} style={styles.card} padding="md">
              <View style={styles.row}>
                <View style={styles.icon}>
                  <Icon name="phone-iphone" size={22} color={Colors.onSurfaceVariant} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyBold" color={Colors.onSurface}>
                    {session.userAgent || t('security.unknownDevice')}
                  </Text>
                  <Text variant="metadata" color={Colors.outline} style={{ marginTop: 2 }}>
                    {session.ip} • {relativeTime(session.createdAt)}
                  </Text>
                  {session.current && (
                    <View style={styles.currentBadge}>
                      <Text variant="labelCaps" color={Colors.primary} style={{ fontSize: 10 }}>
                        {t('security.sessionCurrent')}
                      </Text>
                    </View>
                  )}
                </View>
                {!session.current && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleRevoke(session.id)}
                    style={styles.revokeBtn}
                  >
                    <Icon name="logout" size={20} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (Colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  card: {
    marginBottom: Spacing.gutter,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  currentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryFixed,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  revokeBtn: {
    padding: 8,
    marginLeft: 8,
  },
});
