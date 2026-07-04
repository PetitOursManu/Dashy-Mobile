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
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { Radius, Spacing, Typography } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';

import { Badge } from '../../components/ui/Badge';
import { AppGrid } from '../../components/AppGrid';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { useColors } from '../../theme/ThemeContext';
import { DrawerMenuButton } from '../../components/DrawerMenuButton';
import { AnimatedFadeIn } from '../../components/AnimatedFadeIn';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

export const DashboardHomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const navigation = useNavigation<NativeStackNavigationProp<DrawerParamList>>();
  const { user } = useAuth();
  const { sync, isLoading, refresh, isStaff } = useSync();
  const { width } = useWindowDimensions();

  if (!sync && isLoading) {
    return <Loading message={t('dashboard.loadingDashboard')} />;
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 18) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };

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
        <AnimatedFadeIn index={0}>
          <View style={styles.header}>
            <DrawerMenuButton />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text variant="bodyBase" color={Colors.onSurfaceVariant}>
                {greeting()},
              </Text>
              <Text variant="headlinePageMobile" color={Colors.onSurface}>
                {user?.nickname || user?.email || t('common.user')}
              </Text>
              {user && <Badge label={user.role} variant="primary" style={{ marginTop: 6 }} />}
            </View>
          </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={1}>
          <Card padding="lg" style={styles.hero}>
          <View style={styles.heroContent}>
            <View style={{ flex: 1 }}>
              <Text variant="headlinePage" color={Colors.onSurface}>
                {t('dashboard.welcomeBack')}
              </Text>
              <Text variant="bodyBase" color={Colors.onSurfaceVariant} style={{ marginTop: 6, maxWidth: 260 }}>
                {t('dashboard.overview')}
              </Text>
            </View>
            <View style={styles.heroIcon}>
              <Text variant="displayLg" color={Colors.primary} style={{ opacity: 0.2 }}>
                ☀
              </Text>
            </View>
          </View>
        </Card>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={2}>
        <View style={styles.stats}>
          <Card padding="md" style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text variant="displayLg" color={Colors.primary}>
                {sync?.apps?.length ?? 0}
              </Text>
            </View>
            <Text variant="labelCaps" color={Colors.onSurfaceVariant}>{t('dashboard.hostedApps')}</Text>
          </Card>

          <Card padding="md" style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text variant="displayLg" color={Colors.primary}>
                {sync?.notifications?.length ?? 0}
              </Text>
            </View>
            <Text variant="labelCaps" color={Colors.onSurfaceVariant}>Notifications</Text>
          </Card>

          {isStaff && (
            <Card padding="md" style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text variant="displayLg" color={Colors.primary}>
                  {sync?.admin?.stats?.totalUsers ?? 0}
                </Text>
              </View>
              <Text variant="labelCaps" color={Colors.onSurfaceVariant}>Users</Text>
            </Card>
          )}
        </View>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={3}>
          <Card padding="md" style={styles.noteCard}>
            <View style={styles.sectionHeader}>
              <Text variant="headlineSection" color={Colors.onSurface}>{t('dashboard.note')}</Text>
              <Button
                title={sync?.note ? 'Edit' : t('common.add')}
                variant="ghost"
                size="small"
                onPress={() => navigation.navigate('Settings', { screen: 'Note', params: { returnTo: 'Dashboard' } })}
              />
            </View>
            {sync?.note ? (
              <RenderHtml
                contentWidth={width - 64}
                source={{ html: sync.note }}
                tagsStyles={{
                  p: { ...Typography.bodyBase, color: Colors.onSurfaceVariant, marginBottom: 8 } as any,
                  h1: { ...Typography.headlineSection, color: Colors.onSurface } as any,
                  h2: { ...Typography.bodyBold, color: Colors.onSurface } as any,
                  li: { ...Typography.bodyBase, color: Colors.onSurfaceVariant } as any,
                }}
              />
            ) : (
              <Text variant="bodyBase" color={Colors.onSurfaceVariant}>
                {t('dashboard.noteEmpty')}
              </Text>
            )}
          </Card>
        </AnimatedFadeIn>

        <AnimatedFadeIn index={4}>
        <View style={styles.sectionHeader}>
          <Text variant="headlineSection" color={Colors.onSurface}>{t('dashboard.recentApps')}</Text>
        </View>

        {sync?.apps ? (
          <AppGrid apps={sync.apps} />
        ) : (
          <EmptyState icon="apps" title={t('dashboard.noAppsYet')} subtitle={t('dashboard.noAppsYetSubtitle')} />
        )}
        </AnimatedFadeIn>

        <View style={{ height: 24 }} />
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
    marginBottom: Spacing.gutter,
  },
  hero: {
    marginBottom: Spacing.gutter,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  heroIcon: {
    marginLeft: 12,
  },
  stats: {
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
  statIcon: {
    marginBottom: 8,
  },
  noteCard: {
    marginBottom: Spacing.gutter,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
});
