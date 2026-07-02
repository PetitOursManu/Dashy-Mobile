import { apiGet, apiPost } from './client';
import { Notification } from '../types/api';

export async function getNotifications(): Promise<{ notifications: Notification[] }> {
  return apiGet('/api/mobile/v1/notifications') as Promise<{ notifications: Notification[] }>;
}

export async function markRead(id: string): Promise<{ ok: true }> {
  return apiPost(`/api/mobile/v1/notifications/${id}/read`) as Promise<{ ok: true }>;
}
