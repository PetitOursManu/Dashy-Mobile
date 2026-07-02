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
import { CatalogApp } from '../../types/api';
import { getCatalog } from '../../api/admin';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TabButton } from '../../components/TabButton';
import { StoreStackParamList } from '../../navigation/StoreStackNavigator';

export const CatalogScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation<NativeStackNavigationProp<StoreStackParamList>>();
  const [apps, setApps] = useState<CatalogApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const { apps: list } = await getCatalog();
    setApps(list);
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
    return <Loading message={t('store.loadingCatalog')} />;
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
          <TabButton title={t('store.installed')} onPress={() => navigation.navigate('Installed')} />
          <TabButton title={t('store.catalog')} active onPress={() => {}} />
          <TabButton title={t('store.stats')} onPress={() => navigation.navigate('Stats')} />
        </View>

        {apps.length === 0 ? (
          <EmptyState icon="category" title={t('store.noResults')} subtitle={t('store.catalogEmpty')} />
        ) : (
          apps.map((app) => (
            <Card key={app.id} style={styles.card} padding="md">
              <View style={styles.row}>
                <View style={styles.icon}>
                  <Icon name="category" size={24} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyBold" color={Colors.onSurface}>{app.name}</Text>
                  <Text variant="bodyBase" color={Colors.onSurfaceVariant}>
                    {app.description || t('store.noDescription')}
                  </Text>
                  <View style={styles.badgeRow}>
                    {app.category && <Badge label={app.category} variant="secondary" />}
                    {app.installed && <Badge label={t('store.installed')} variant="primary" />}
                    {app.updateAvailable && <Badge label={t('store.update')} variant="tertiary" />}
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
