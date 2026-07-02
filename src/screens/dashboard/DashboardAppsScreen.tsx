import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing } from '../../theme/tokens';
import { useSync } from '../../context/SyncContext';
import { AppGrid } from '../../components/AppGrid';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Text } from '../../components/ui/Text';
import { useColors } from '../../theme/ThemeContext';
import { DrawerMenuButton } from '../../components/DrawerMenuButton';

export const DashboardAppsScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const { sync, isLoading, refresh } = useSync();

  if (!sync && isLoading) {
    return <Loading message={t('dashboard.loadingApps')} />;
  }

  const apps = sync?.apps ?? [];

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
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={Colors.primary} />
        }
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <DrawerMenuButton />
          <Text variant="headlinePage" color={Colors.onSurface} style={{ marginLeft: 8 }}>
            {t('dashboard.apps')}
          </Text>
        </View>

        {apps.length === 0 ? (
          <EmptyState icon="apps" title={t('dashboard.noAppsYetGrid')} subtitle={t('dashboard.noAppsYetGridSubtitle')} />
        ) : (
          <AppGrid apps={apps} />
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
});
