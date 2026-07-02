import { apiGet, apiPost } from './client';
import { ChatMessage, ChatStatus, ChatReply } from '../types/api';

export async function getChatStatus(): Promise<ChatStatus> {
  return apiGet('/api/mobile/v1/chat/status') as Promise<ChatStatus>;
}

export async function sendChat(messages: ChatMessage[]): Promise<ChatReply> {
  return apiPost('/api/mobile/v1/chat', { messages }) as Promise<ChatReply>;
}