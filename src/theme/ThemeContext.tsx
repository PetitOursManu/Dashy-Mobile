import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ColorPalette, ThemeName, themes } from './colors';
import * as profileApi from '../api/profile';
import { useSync } from '../context/SyncContext';

interface ThemeContextValue {
  theme: ThemeName;
  colors: ColorPalette;
  isGlass: boolean;
  setTheme: (theme: ThemeName) => void;
  applyTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemeName>('light');

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
  }, []);

  const persistTheme = useCallback(async (next: ThemeName) => {
    try {
      const serverTheme = next === 'glass' ? 'image' : next;
      await profileApi.updateProfile({ theme: serverTheme as any });
    } catch {
      // ignore persistence errors; local theme still applies
    }
  }, []);

  const applyTheme = useCallback(
    (next: ThemeName) => {
      setTheme(next);
      persistTheme(next);
    },
    [setTheme, persistTheme],
  );

  const value = useMemo(() => {
    return {
      theme,
      colors: themes[theme],
      isGlass: theme === 'glass',
      setTheme,
      applyTheme,
    };
  }, [theme, setTheme, applyTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function useColors(): ColorPalette {
  return useTheme().colors;
}

export const ThemeSync: React.FC = () => {
  const { sync } = useSync();
  const { setTheme } = useTheme();

  useEffect(() => {
    const userTheme = sync?.user?.theme;
    if (userTheme && ['light', 'dark', 'violet', 'glass'].includes(userTheme)) {
      setTheme(userTheme as ThemeName);
    }
  }, [sync?.user?.theme, setTheme]);

  return null;
};
