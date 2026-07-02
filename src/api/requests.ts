import { apiGet, apiPost } from './client';
import { ProjectRequest } from '../types/api';

export async function getRequests(): Promise<{ requests: ProjectRequest[] }> {
  return apiGet('/api/mobile/v1/requests') as Promise<{ requests: ProjectRequest[] }>;
}

export async function createRequest(payload: {
  kind?: 'idea' | 'file';
  message: string;
}): Promise<{ request: ProjectRequest }> {
  return apiPost('/api/mobile/v1/requests', payload) as Promise<{ request: ProjectRequest }>;
}

// --- Staff: request management (web API endpoints, accept Bearer token) ---

export async function getAdminRequests(status?: string): Promise<{ requests: ProjectRequest[] }> {
  const path = status ? `/api/requests/admin?status=${status}` : '/api/requests/admin';
  return apiGet(path) as Promise<{ requests: ProjectRequest[] }>;
}

export async function setRequestStatus(
  id: string,
  status: 'pending' | 'resolved' | 'dismissed',
): Promise<{ request: ProjectRequest }> {
  return apiPost(`/api/requests/${id}/status`, { status }) as Promise<{ request: ProjectRequest }>;
}

export async function replyToRequest(
  id: string,
  message: string,
): Promise<{ request: ProjectRequest }> {
  return apiPost(`/api/requests/${id}/reply`, { message }) as Promise<{ request: ProjectRequest }>;
}

export async function archiveRequest(
  id: string,
  archived: boolean,
): Promise<{ request: ProjectRequest }> {
  return apiPost(`/api/requests/${id}/archive`, { archived }) as Promise<{ request: ProjectRequest }>;
}
