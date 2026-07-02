import React, { createContext, useContext, useEffect, useState } from 'react';
import { getServerInfo } from '../api/auth';
import { ServerInfo } from '../types/api';
import { deleteServerUrl, getServerUrl, setServerUrl } from '../utils/storage';
import { i18n } from '../i18n/config';

interface ServerContextValue {
  serverUrl: string | null;
  serverInfo: ServerInfo | null;
  isLoading: boolean;
  error: string | null;
  setServerUrl: (url: string) => Promise<void>;
  clearServerUrl: () => Promise<void>;
  refetchInfo: () => Promise<void>;
}

const ServerContext = createContext<ServerContextValue | undefined>(undefined);

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [serverUrl, setServerUrlState] = useState<string | null>(null);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getServerUrl()
      .then((url) => {
        if (!mounted) return;
        setServerUrlState(url);
        if (url) {
          return getServerInfo();
        }
        return null;
      })
      .then((info) => {
        if (!mounted) return;
        if (info) setServerInfo(info);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const setServerUrlValue = async (url: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await setServerUrl(url);
      const info = await getServerInfo();
      if (info.apiVersion !== 1) {
        throw new Error(i18n.t('errors.unsupportedApiVersion'));
      }
      setServerUrlState(url);
      setServerInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearServerUrl = async () => {
    await deleteServerUrl();
    setServerUrlState(null);
    setServerInfo(null);
    setError(null);
  };

  const refetchInfo = async () => {
    if (!serverUrl) return;
    setError(null);
    setIsLoading(true);
    try {
      const info = await getServerInfo();
      setServerInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ServerContext.Provider
      value={{
        serverUrl,
        serverInfo,
        isLoading,
        error,
        setServerUrl: setServerUrlValue,
        clearServerUrl,
        refetchInfo,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export function useServer(): ServerContextValue {
  const ctx = useContext(ServerContext);
  if (!ctx) throw new Error('useServer must be used within ServerProvider');
  return ctx;
}
