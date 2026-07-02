import { apiGet, apiPost } from './client';
import { App } from '../types/api';

export async function getApps(): Promise<{ apps: App[] }> {
  return apiGet('/api/mobile/v1/apps') as Promise<{ apps: App[] }>;
}

export async function getApp(id: string): Promise<{ app: App }> {
  return apiGet(`/api/mobile/v1/apps/${id}`) as Promise<{ app: App }>;
}

export async function toggleFavorite(id: string): Promise<{ id: string; isFavorite: boolean }> {
  return apiPost(`/api/mobile/v1/apps/${id}/favorite`) as Promise<{
    id: string;
    isFavorite: boolean;
  }>;
}
