import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as syncApi from '../api/sync';
import * as appsApi from '../api/apps';
import * as notificationsApi from '../api/notifications';
import * as requestsApi from '../api/requests';
import * as profileApi from '../api/profile';
import { ProjectRequest, SyncData, User } from '../types/api';
import { useAuth } from './AuthContext';

interface SyncContextValue {
  sync: SyncData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggleFavorite: (appId: string) => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
  addRequest: (request: ProjectRequest) => void;
  updateRequest: (request: ProjectRequest) => void;
  removeRequest: (id: string) => void;
  updateUser: (user: User) => void;
  updateNote: (content: string) => void;
  isStaff: boolean;
  isAdmin: boolean;
}

const SyncContext = createContext<SyncContextValue | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [sync, setSync] = useState<SyncData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await syncApi.sync();
      setSync(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    }
  }, [isAuthenticated, refresh]);

  const toggleFavorite = useCallback(
    async (appId: string) => {
      const result = await appsApi.toggleFavorite(appId);
      setSync((prev) => {
        if (!prev) return prev;
        const apps = prev.apps.map((app) =>
          app.id === appId ? { ...app, isFavorite: result.isFavorite } : app,
        );
        const favorites = result.isFavorite
          ? Array.from(new Set([...prev.favorites, appId]))
          : prev.favorites.filter((id) => id !== appId);
        return { ...prev, apps, favorites };
      });
    },
    [setSync],
  );

  const markRead = useCallback(
    async (notificationId: string) => {
      await notificationsApi.markRead(notificationId);
      setSync((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          notifications: prev.notifications.filter((n) => n.id !== notificationId),
        };
      });
    },
    [setSync],
  );

  const addRequest = useCallback((request: ProjectRequest) => {
    setSync((prev) => {
      if (!prev) return prev;
      return { ...prev, requests: [request, ...prev.requests] };
    });
  }, []);

  const updateRequest = useCallback((request: ProjectRequest) => {
    setSync((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        requests: prev.requests.map((r) => (r.id === request.id ? request : r)),
      };
    });
  }, []);

  const removeRequest = useCallback((id: string) => {
    setSync((prev) => {
      if (!prev) return prev;
      return { ...prev, requests: prev.requests.filter((r) => r.id !== id) };
    });
  }, []);

  const updateUser = useCallback((user: User) => {
    setSync((prev) => {
      if (!prev) return prev;
      return { ...prev, user };
    });
  }, []);

  const updateNote = useCallback((content: string) => {
    setSync((prev) => {
      if (!prev) return prev;
      return { ...prev, note: content };
    });
  }, []);

  const isStaff = useMemo(() => {
    return sync?.user
      ? ['admin', 'subadmin'].includes(sync.user.role)
      : false;
  }, [sync]);

  const isAdmin = useMemo(() => {
    return sync?.user?.role === 'admin';
  }, [sync]);

  return (
    <SyncContext.Provider
      value={{
        sync,
        isLoading,
        error,
        refresh,
        toggleFavorite,
        markRead,
        addRequest,
        updateRequest,
        removeRequest,
        updateUser,
        updateNote,
        isStaff,
        isAdmin,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export function useSync(): SyncContextValue {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSync must be used within SyncProvider');
  return ctx;
}
