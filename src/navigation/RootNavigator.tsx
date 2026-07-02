import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer, NavigationContainerRef, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ServerUrlScreen } from '../screens/onboarding/ServerUrlScreen';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { TwoFactorScreen } from '../screens/auth/TwoFactorScreen';
import { DrawerNavigator } from './DrawerNavigator';
import { WebViewScreen } from '../screens/WebViewScreen';
import { useServer } from '../context/ServerContext';
import { useAuth } from '../context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type AuthStackParamList = {
  Login: undefined;
  TwoFactor: { pendingToken: string };
};

export type OnboardingStackParamList = {
  ServerUrl: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  WebView: { url: string; title?: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="TwoFactor" component={TwoFactorScreen} />
    </AuthStack.Navigator>
  );
}

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
      <OnboardingStack.Screen name="ServerUrl" component={ServerUrlScreen} />
    </OnboardingStack.Navigator>
  );
}

export const RootNavigator: React.FC = () => {
  const { serverUrl, isLoading: serverLoading } = useServer();
  const { isAuthenticated, isLoading: authLoading, restore } = useAuth();
  const [ready, setReady] = useState(false);
  const navigationRef = useRef<NavigationContainerRef<ParamListBase>>(null);
  const wasAuthenticatedRef = useRef(isAuthenticated);

  useEffect(() => {
    const bootstrap = async () => {
      await restore();
      setReady(true);
    };
    bootstrap();
  }, [restore]);

  useEffect(() => {
    if (!ready || serverLoading || authLoading) return;
    if (isAuthenticated && !wasAuthenticatedRef.current) {
      navigationRef.current?.navigate('Main' as never);
    }
    wasAuthenticatedRef.current = isAuthenticated;
  }, [ready, serverLoading, authLoading, isAuthenticated]);

  if (!ready || serverLoading || authLoading) {
    return <SplashScreen />;
  }

  let initialRoute: keyof RootStackParamList = 'Onboarding';
  if (serverUrl && isAuthenticated) {
    initialRoute = 'Main';
  } else if (serverUrl && !isAuthenticated) {
    initialRoute = 'Auth';
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={initialRoute}
        >
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
          <RootStack.Screen name="Auth" component={AuthNavigator} />
          <RootStack.Screen name="Main" component={DrawerNavigator} />
          <RootStack.Screen
            name="WebView"
            component={WebViewScreen}
            options={{ presentation: 'fullScreenModal' }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};
