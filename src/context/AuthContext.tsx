import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getMe, login, logout, verify2FA } from '../api/auth';
import { onAuthLost } from '../api/client';
import { LoginPayload, TwoFactorPayload, User } from '../types/api';
import { deleteToken, getToken, setToken } from '../utils/storage';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<{ needs2fa: true; pendingToken: string } | { needs2fa: false; user: User }>;
  verify2FA: (payload: TwoFactorPayload) => Promise<User>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(async () => {
    await deleteToken();
    setTokenState(null);
    setUser(null);
  }, []);

  const restore = useCallback(async () => {
    setIsLoading(true);
    try {
      const stored = await getToken();
      if (!stored) {
        setIsLoading(false);
        return;
      }
      setTokenState(stored);
      const { user: me } = await getMe();
      setUser(me);
    } catch {
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    const unsubscribe = onAuthLost(() => {
      clearAuth();
    });
    return unsubscribe;
  }, [clearAuth]);

  const handleLogin = async (
    payload: LoginPayload,
  ): Promise<
    | { needs2fa: true; pendingToken: string }
    | { needs2fa: false; user: User }
  > => {
    const res = await login(payload);

    if ('twoFactorRequired' in res) {
      return { needs2fa: true, pendingToken: res.pendingToken };
    }

    await setToken(res.token);
    setTokenState(res.token);
    setUser(res.user);
    return { needs2fa: false, user: res.user };
  };

  const handleVerify2FA = async (payload: TwoFactorPayload): Promise<User> => {
    const { token: newToken, user: me } = await verify2FA(payload);
    await setToken(newToken);
    setTokenState(newToken);
    setUser(me);
    return me;
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch {
      // ignore server errors during logout
    } finally {
      await clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login: handleLogin,
        verify2FA: handleVerify2FA,
        logout: handleLogout,
        restore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
