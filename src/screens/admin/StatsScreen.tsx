import React, { useEffect, useState, useMemo } from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Radius, Spacing } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { StatsOverview } from '../../types/api';
import { getStatsOverview } from '../../api/admin';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TabButton } from '../../components/TabButton';
import { StoreStackParamList } from '../../navigation/StoreStackNavigator';

export const StatsScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation<NativeStackNavigationProp<StoreStackParamList>>();
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const data = await getStatsOverview();
    setStats(data);
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
    return <Loading message={t('store.loadingStats')} />;
  }

  if (!stats) {
    return <EmptyState icon="timeline" title={t('store.noStats')} subtitle={t('store.noStatsSubtitle')} />;
  }

  const maxOpens = Math.max(...stats.opensByMonth.map((m) => m.count), 1);

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
        <ScreenHeader title={t('store.stats')} />

        <View style={styles.tabRow}>
          <TabButton title={t('store.installed')} onPress={() => navigation.navigate('Installed')} />
          <TabButton title={t('store.catalog')} onPress={() => navigation.navigate('Catalog')} />
          <TabButton title={t('store.stats')} active onPress={() => {}} />
        </View>

        <View style={styles.statsGrid}>
          <Card padding="md" style={styles.statCard}>
            <Text variant="displayLg" color={Colors.primary}>{stats.totalApps}</Text>
            <Text variant="labelCaps" color={Colors.onSurfaceVariant}>{t('store.totalApps')}</Text>
          </Card>
          <Card padding="md" style={styles.statCard}>
            <Text variant="displayLg" color={Colors.primary}>{stats.totalUsers}</Text>
            <Text variant="labelCaps" color={Colors.onSurfaceVariant}>{t('store.totalUsers')}</Text>
          </Card>
          <Card padding="md" style={styles.statCard}>
            <Text variant="displayLg" color={Colors.primary}>{stats.totalOpens}</Text>
            <Text variant="labelCaps" color={Colors.onSurfaceVariant}>{t('store.opens')}</Text>
          </Card>
        </View>

        <Card padding="md" style={styles.chartCard}>
          <Text variant="headlineSection" color={Colors.onSurface} style={{ marginBottom: 12 }}>
            {t('store.opensByMonth')}
          </Text>
          <View style={styles.chart}>
            {stats.opensByMonth.map((month) => (
              <View key={month.label} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${(month.count / maxOpens) * 100}%` },
                    ]}
                  />
                </View>
                <Text variant="metadata" color={Colors.outline} style={{ marginTop: 4 }}>
                  {month.label}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <Card padding="md" style={styles.topAppsCard}>
          <Text variant="headlineSection" color={Colors.onSurface} style={{ marginBottom: 12 }}>
            {t('store.topApps')}
          </Text>
          {stats.topApps.map((app, index) => (
            <View key={app.id} style={styles.topAppRow}>
              <Text variant="bodyBold" color={Colors.onSurface}>
                {index + 1}. {app.name}
              </Text>
              <Text variant="bodyBase" color={Colors.onSurfaceVariant}>
                {app.openCount} {t('store.opens')}
              </Text>
            </View>
          ))}
        </Card>
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
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginBottom: Spacing.gutter,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 8,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  chartCard: {
    marginBottom: Spacing.gutter,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: 24,
    height: 100,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radius.full,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.full,
    minHeight: 4,
  },
  topAppsCard: {
    marginBottom: Spacing.gutter,
  },
  topAppRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(224, 192, 180, 0.3)',
  },
});
