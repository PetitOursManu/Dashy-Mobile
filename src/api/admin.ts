import { apiGet } from './client';
import { CatalogApp, InstalledApp, StatsOverview, StoreConfig } from '../types/api';

export async function getInstalledApps(): Promise<{ installed: InstalledApp[] }> {
  return apiGet('/api/mobile/v1/store/installed') as Promise<{ installed: InstalledApp[] }>;
}

export async function getCatalog(): Promise<{ apps: CatalogApp[] }> {
  return apiGet('/api/mobile/v1/store/catalog') as Promise<{ apps: CatalogApp[] }>;
}

export async function getStoreConfig(): Promise<StoreConfig> {
  return apiGet('/api/mobile/v1/store/config') as Promise<StoreConfig>;
}

export async function getStatsOverview(): Promise<StatsOverview> {
  return apiGet('/api/mobile/v1/stats/overview') as Promise<StatsOverview>;
}
