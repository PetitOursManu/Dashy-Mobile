import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Radius } from '../theme/tokens';
import { useColors } from '../theme/ThemeContext';
import { ColorPalette } from '../theme/colors';
import { Icon } from '../components/ui/Icon';
import { Loading } from '../components/ui/Loading';
import { useServer } from '../context/ServerContext';
import { getToken } from '../utils/storage';
import { buildAbsoluteUrl } from '../api/client';
import { RootStackParamList } from '../navigation/RootNavigator';

type WebViewRouteProp = RouteProp<RootStackParamList, 'WebView'>;
type WebViewNavProp = NativeStackNavigationProp<RootStackParamList, 'WebView'>;

export const WebViewScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation<WebViewNavProp>();
  const route = useRoute<WebViewRouteProp>();
  const { serverUrl } = useServer();
  const [token, setToken] = useState<string | null>(null);

  const { url: relativeUrl } = route.params;
  const targetUrl = serverUrl ? buildAbsoluteUrl(serverUrl, relativeUrl) : relativeUrl;

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  if (!token || !targetUrl) {
    return <Loading message={t('app.preparingApp')} />;
  }

  const injectJs = `document.cookie = "dashy_token=${token}; path=/; max-age=604800"; true;`;

  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: targetUrl,
          headers: { Authorization: `Bearer ${token}` },
        }}
        injectedJavaScriptBeforeContentLoaded={injectJs}
        startInLoadingState
        renderLoading={() => <Loading message={t('app.loadingApp')} />}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        style={styles.webview}
      />
      {/* Floating close button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeBtn}
        activeOpacity={0.8}
      >
        <Icon name="close" size={22} color={Colors.onSurface} />
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    webview: {
      flex: 1,
    },
    closeBtn: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 60 : 40,
      right: 16,
      width: 40,
      height: 40,
      borderRadius: Radius.full,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
  });