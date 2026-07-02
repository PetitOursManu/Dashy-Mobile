import { apiGet } from './client';
import { SyncData } from '../types/api';

export async function sync(): Promise<SyncData> {
  return apiGet('/api/mobile/v1/sync') as Promise<SyncData>;
}
