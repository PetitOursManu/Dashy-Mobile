export type UserRole = 'admin' | 'subadmin' | 'user' | 'temp';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  expiresAt: string | null;
  nickname: string;
  fullName: string;
  jobTitle: string;
  language: string;
  theme: 'light' | 'dark' | 'violet' | 'glass';
  glass: boolean;
  glassDark: boolean;
  timezone: string;
  dateFormat: '' | 'dmy' | 'mdy' | 'iso';
  chatEnabled: boolean;
  twoFactorEnabled: boolean;
  hasAvatar: boolean;
  hasBackground: boolean;
  allowedApps: string[];
  favorites: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AppVersion {
  vid: string;
  entryFile: string;
  createdAt: string;
}

export interface ShareInfo {
  token: string;
  url: string;
  expiresAt: string | null;
  hasPassword: boolean;
}

export interface App {
  id: string;
  name: string;
  description: string;
  slug: string;
  entryFile: string;
  previewImage: string | null;
  category: string | null;
  externalUrl: string | null;
  owner: string;
  openCount: number;
  lastOpenedAt: string | null;
  versions: AppVersion[];
  url: string;
  previewUrl: string;
  isFavorite: boolean;
  share: ShareInfo | null;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  message: string;
  requestMessage: string | null;
  createdAt: string;
}

export interface ProjectRequest {
  id: string;
  user: string;
  userEmail: string;
  kind: 'idea' | 'file';
  message: string;
  status: 'pending' | 'resolved' | 'dismissed';
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionInfo {
  id: string;
  userAgent: string;
  ip: string;
  createdAt: string;
  lastSeenAt: string;
  current: boolean;
}

export interface ServerInfo {
  apiVersion: number;
  server: {
    name: string;
    allowRegistration: boolean;
  };
  features: {
    twoFactor: boolean;
    store: boolean;
    notifications: boolean;
    requests: boolean;
    chat: boolean;
  };
}

export interface SyncData {
  apiVersion: number;
  serverTime: string;
  server: ServerInfo['server'];
  user: User;
  note: string;
  apps: App[];
  favorites: string[];
  notifications: Notification[];
  requests: ProjectRequest[];
  chat?: {
    available: boolean;
    canRequest: boolean;
  };
  admin?: {
    store: {
      installed: InstalledApp[];
    };
    stats: {
      totalApps: number;
      totalUsers: number;
      pendingRequests: number;
    };
  };
}

export interface InstalledApp {
  id: string;
  manifestId: string;
  name: string;
  type: 'tile' | 'deploy' | 'static';
  sourceName: string;
  hostedApp: string | null;
  installedVersion: string;
  slug: string | null;
  servingMode: 'path' | 'subdomain' | null;
  deployDriver: string | null;
  serviceName: string;
  volumes: { name: string; mountPath: string }[];
  createdAt: string;
  updatedAt: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  managedSource: boolean;
  sourceId: string | null;
}

export interface CatalogApp {
  id: string;
  name: string;
  description: string;
  category: string | null;
  icon: string | null;
  installed: boolean;
  updateAvailable: boolean;
}

export interface StoreConfig {
  config: Record<string, unknown>;
  drivers: string[];
  docker: boolean;
}

export interface StatsOverview {
  totalApps: number;
  totalUsers: number;
  totalOpens: number;
  opensByMonth: { label: string; count: number }[];
  topApps: { id: string; name: string; slug: string; openCount: number }[];
}

export interface LoginPayload {
  email: string;
  password: string;
  device?: string;
}

export interface LoginSuccess {
  token: string;
  user: User;
}

export interface Login2faRequired {
  twoFactorRequired: true;
  pendingToken: string;
}

export type LoginResponse = LoginSuccess | Login2faRequired;

export interface TwoFactorPayload {
  pendingToken: string;
  token: string;
  device?: string;
}

export interface ApiErrorBody {
  error: string;
  details?: { path: string; message: string }[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatStatus {
  available: boolean;
  canRequest: boolean;
}

export interface ChatProposal {
  type: 'add_catalogue' | 'add_source' | 'add_app';
  name?: string;
  source?: string;
  manifest?: string;
  sourceType?: string;
  location?: string;
}

export interface ChatReply {
  reply: string;
  proposal?: ChatProposal;
}
