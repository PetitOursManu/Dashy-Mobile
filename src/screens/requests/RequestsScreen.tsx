import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Spacing, Radius } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { useSync } from '../../context/SyncContext';
import { RequestItem } from '../../components/RequestItem';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loading } from '../../components/ui/Loading';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/ScreenHeader';
import { RequestsStackParamList } from './RequestsStackNavigator';
import { ProjectRequest } from '../../types/api';
import * as requestsApi from '../../api/requests';

type FilterTab = 'all' | 'pending' | 'resolved' | 'dismissed' | 'archived';

const FILTERS: FilterTab[] = ['all', 'pending', 'resolved', 'dismissed', 'archived'];

const FILTER_LABEL_KEYS: Record<FilterTab, string> = {
  all: 'requests.filter_all',
  pending: 'requests.filter_pending',
  resolved: 'requests.filter_resolved',
  dismissed: 'requests.filter_dismissed',
  archived: 'requests.filter_archived',
};

export const RequestsScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation<NativeStackNavigationProp<RequestsStackParamList>>();
  const { isStaff, updateRequest, removeRequest } = useSync();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>('all');

  const loadRequests = useCallback(async (status: FilterTab) => {
    setIsLoading(true);
    setError(null);
    try {
      const { requests: data } = await requestsApi.getAdminRequests(status);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('requests.failedLoadRequests'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests(filter);
  }, [filter, loadRequests]);

  const handleReply = async (id: string, message: string) => {
    const { request } = await requestsApi.replyToRequest(id, message);
    updateRequest(request);
    setRequests((prev) => prev.map((r) => (r.id === id ? request : r)));
  };

  const handleSetStatus = async (id: string, status: 'pending' | 'resolved' | 'dismissed') => {
    const { request } = await requestsApi.setRequestStatus(id, status);
    updateRequest(request);
    setRequests((prev) => prev.map((r) => (r.id === id ? request : r)));
  };

  const handleArchive = async (id: string, archived: boolean) => {
    const { request } = await requestsApi.archiveRequest(id, archived);
    updateRequest(request);
    if (filter !== 'all' && filter !== 'archived') {
      // Remove from current list since archived items don't appear in non-archived filters
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } else {
      setRequests((prev) => prev.map((r) => (r.id === id ? request : r)));
    }
  };

  if (!requests.length && isLoading && !error) {
    return <Loading message={t('requests.loadingRequests')} />;
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
          <RefreshControl refreshing={isLoading} onRefresh={() => loadRequests(filter)} tintColor={Colors.primary} />
        }
      >
        <ScreenHeader
          title={t('requests.title')}
          right={
            <Button
              title={t('requests.new')}
              size="small"
              onPress={() => navigation.navigate('NewRequest')}
            />
          }
        />

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterTab,
                filter === f && styles.filterTabActive,
              ]}
            >
              <Text
                variant="labelCaps"
                color={filter === f ? Colors.onPrimary : Colors.outline}
              >
                {t(FILTER_LABEL_KEYS[f])}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {error && (
          <View style={styles.errorBox}>
            <Text variant="bodyBase" color={Colors.error}>
              {error}
            </Text>
          </View>
        )}

        {requests.length === 0 && !error ? (
          <EmptyState
            icon="lightbulb"
            title={t('requests.emptyTitle')}
            subtitle={t('requests.emptySubtitle')}
          />
        ) : (
          requests.map((r) => (
            <RequestItem
              key={r.id}
              request={r}
              isStaff={isStaff}
              onReply={handleReply}
              onSetStatus={handleSetStatus}
              onArchive={handleArchive}
            />
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
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  errorBox: {
    marginBottom: 12,
    padding: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.errorContainer,
  },
});