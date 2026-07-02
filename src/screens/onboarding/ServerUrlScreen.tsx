import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Radius, Spacing, Typography } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { Icon } from '../../components/ui/Icon';
import { DebugPanel } from '../../components/DebugPanel';
import { useServer } from '../../context/ServerContext';

export const ServerUrlScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const { serverUrl, setServerUrl, isLoading } = useServer();
  const [url, setUrl] = useState(serverUrl ?? '');
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const handleConnect = async () => {
    if (!url.trim()) return;
    setError(null);
    setLocalLoading(true);
    try {
      await setServerUrl(url.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.failedConnect'));
    } finally {
      setLocalLoading(false);
    }
  };

  if (isLoading && !url) {
    return <Loading message={t('onboarding.checkingServer')} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(246, 222, 205, 0.4)', Colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logo}>
            <View style={styles.logoCircle}>
              <Icon name="widgets" size={40} color={Colors.onPrimary} />
            </View>
            <Text variant="displayLg" color={Colors.primary} style={{ marginTop: 16 }}>
              {t('onboarding.dashy')}
            </Text>
            <Text variant="bodyBase" color={Colors.onSurfaceVariant} style={{ marginTop: 8 }}>
              {t('onboarding.connectToServer')}
            </Text>
          </View>

          <View style={styles.form}>
            <Text variant="headlineSection" color={Colors.onSurface}>
              {t('onboarding.serverUrl')}
            </Text>
            <Text variant="bodyBase" color={Colors.onSurfaceVariant} style={{ marginTop: 4, marginBottom: 16 }}>
              {t('onboarding.serverUrlHint')}
            </Text>

            <Input
              value={url}
              onChangeText={setUrl}
              placeholder={t('onboarding.serverUrlPlaceholder')}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              returnKeyType="go"
              onSubmitEditing={handleConnect}
              leftIcon={<Icon name="link" size={20} color={Colors.outline} />}
              containerStyle={styles.input}
            />

            {error && (
              <View style={styles.errorRow}>
                <Icon name="error" size={18} color={Colors.error} />
                <Text variant="bodyBase" color={Colors.error} style={{ marginLeft: 8 }}>
                  {error}
                </Text>
              </View>
            )}

            <Button
              title={localLoading ? t('onboarding.connecting') : t('onboarding.connect')}
              onPress={handleConnect}
              fullWidth
              style={{ marginTop: 12 }}
              disabled={!url.trim() || localLoading}
            />

            <DebugPanel />

            {url.includes('localhost') || url.includes('127.0.0.1') ? (
              <View style={styles.hintRow}>
                <Icon name="info" size={16} color={Colors.outline} />
                <Text variant="metadata" color={Colors.outline} style={{ marginLeft: 6, flex: 1 }}>
                  {t('onboarding.androidEmulatorHint')}
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (Colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.marginMobile,
  },
  logo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  form: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: Radius.xl,
    padding: Spacing.gutter,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  input: {
    marginBottom: 12,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(246, 222, 205, 0.5)',
    borderRadius: Radius.md,
  },
});
