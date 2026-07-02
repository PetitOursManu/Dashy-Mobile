import { apiGet, apiPatch, apiPut } from './client';
import { User } from '../types/api';

export type ProfileUpdatePayload = Partial<Pick<
  User,
  | 'nickname'
  | 'fullName'
  | 'jobTitle'
  | 'language'
  | 'theme'
  | 'glass'
  | 'glassDark'
  | 'timezone'
  | 'dateFormat'
>>;

export async function updateProfile(payload: ProfileUpdatePayload): Promise<{ user: User }> {
  return apiPatch('/api/mobile/v1/profile', payload) as Promise<{ user: User }>;
}

export async function getNote(): Promise<{ content: string }> {
  return apiGet('/api/mobile/v1/note') as Promise<{ content: string }>;
}

export async function updateNote(content: string): Promise<{ content: string }> {
  return apiPut('/api/mobile/v1/note', { content }) as Promise<{ content: string }>;
}
