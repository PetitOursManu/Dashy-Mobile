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
import { InstalledApp } from '../../types/api';
import { getInstalledApps } from '../../api/admin';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StoreStackParamList } from '../../navigation/StoreStackNavigator';
import { TabButton } from '../../components/TabButton';

export const InstalledScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation<NativeStackNavigationProp<StoreStackParamList>>();
  const [installed, setInstalled] = useState<InstalledApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const { installed: list } = await getInstalledApps();
    setInstalled(list);
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
    return <Loading message={t('store.loadingStoreApps')} />;
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
        <ScreenHeader title={t('store.store')} />

        <View style={styles.tabRow}>
          <TabButton title={t('store.installed')} active onPress={() => {}} />
          <TabButton title={t('store.catalog')} onPress={() => navigation.navigate('Catalog')} />
          <TabButton title={t('store.stats')} onPress={() => navigation.navigate('Stats')} />
        </View>

        {installed.length === 0 ? (
          <EmptyState icon="storefront" title={t('store.noInstalledApps')} subtitle={t('store.storeEmpty')} />
        ) : (
          installed.map((app) => (
            <Card key={app.id} style={styles.card} padding="md">
              <View style={styles.row}>
                <View style={styles.icon}>
                  <Icon name="inventory" size={24} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyBold" color={Colors.onSurface}>{app.name}</Text>
                  <Text variant="metadata" color={Colors.onSurfaceVariant}>
                    {app.sourceName} • v{app.installedVersion}
                  </Text>
                  <View style={styles.badgeRow}>
                    <Badge label={app.type} variant="secondary" />
                    {app.updateAvailable && <Badge label={t('store.update')} variant="primary" />}
                  </View>
                </View>
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
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  card: {
    marginBottom: Spacing.gutter,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
});
