import {
  apiDelete,
  apiGet,
  apiPost,
  publicGet,
  publicPost,
} from './client';
import {
  LoginPayload,
  LoginResponse,
  ServerInfo,
  SessionInfo,
  TwoFactorPayload,
  User,
} from '../types/api';

export async function getServerInfo(): Promise<ServerInfo> {
  return publicGet('/api/mobile/v1/info') as Promise<ServerInfo>;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return publicPost('/api/mobile/v1/auth/login', payload) as Promise<LoginResponse>;
}

export async function verify2FA(payload: TwoFactorPayload): Promise<{ token: string; user: User }> {
  return publicPost('/api/mobile/v1/auth/2fa/verify', payload) as Promise<{
    token: string;
    user: User;
  }>;
}

export async function logout(): Promise<{ ok: true }> {
  return apiPost('/api/mobile/v1/auth/logout') as Promise<{ ok: true }>;
}

export async function getMe(): Promise<{ user: User }> {
  return apiGet('/api/mobile/v1/auth/me') as Promise<{ user: User }>;
}

export async function getSessions(): Promise<{ sessions: SessionInfo[] }> {
  return apiGet('/api/mobile/v1/auth/sessions') as Promise<{ sessions: SessionInfo[] }>;
}

export async function revokeSession(id: string): Promise<{ ok: true; current: boolean }> {
  return apiDelete(`/api/mobile/v1/auth/sessions/${id}`) as Promise<{
    ok: true;
    current: boolean;
  }>;
}
