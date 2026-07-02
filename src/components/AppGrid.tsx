import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { App } from '../types/api';
import { AppCard } from './AppCard';
import { EmptyState } from './ui/EmptyState';

interface Props {
  apps: App[];
}

export const AppGrid: React.FC<Props> = ({ apps }) => {
  const { t } = useTranslation();
  if (apps.length === 0) {
    return <EmptyState icon="apps" title={t('app.noAppsYet')} subtitle={t('app.noAppsYetSubtitle')} />;
  }

  return (
    <View style={styles.grid}>
      {apps.map((app) => (
        <View key={app.id} style={styles.item}>
          <AppCard app={app} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  item: {
    width: '50%',
    paddingHorizontal: 8,
  },
});
