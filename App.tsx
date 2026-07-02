import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ServerProvider } from './src/context/ServerContext';
import { AuthProvider } from './src/context/AuthContext';
import { SyncProvider } from './src/context/SyncContext';
import { ThemeProvider, ThemeSync } from './src/theme/ThemeContext';
import { LanguageSync } from './src/i18n/config';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Loading } from './src/components/ui/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  return (
    <SafeAreaProvider>
      <ServerProvider>
        <ThemeProvider>
          <AuthProvider>
            <SyncProvider>
              {fontsLoaded ? (
                <>
                  <ThemeSync />
                  <LanguageSync />
                  <RootNavigator />
                  <StatusBar style="auto" />
                </>
              ) : (
                <Loading />
              )}
            </SyncProvider>
          </AuthProvider>
        </ThemeProvider>
      </ServerProvider>
    </SafeAreaProvider>
  );
}
