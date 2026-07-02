import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Spacing } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { useServer } from '../../context/ServerContext';
import { useAuth } from '../../context/AuthContext';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';

export const ServerSettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation();
  const { serverUrl, setServerUrl, clearServerUrl } = useServer();
  const { logout } = useAuth();
  const [url, setUrl] = useState(serverUrl ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!url.trim()) return;
    setError(null);
    setLoading(true);
    try {
      await setServerUrl(url.trim());
      await logout();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.failedConnect'));
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      t('profile.disconnectTitle'),
      t('profile.disconnectMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.disconnect'),
          style: 'destructive',
          onPress: async () => {
            await clearServerUrl();
            await logout();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={['rgba(246, 222, 205, 0.4)', Colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Button
            title={t('common.back')}
            variant="ghost"
            size="small"
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlinePage" color={Colors.onSurface}>{t('profile.server')}</Text>
          <View style={{ width: 60 }} />
        </View>

        <Input
          value={url}
          onChangeText={setUrl}
          placeholder={t('profile.serverUrlPlaceholder')}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          containerStyle={styles.input}
          leftIcon={<Icon name="dns" size={20} color={Colors.outline} />}
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
          title={loading ? t('common.saving') : t('profile.saveReconnect')}
          onPress={handleSave}
          fullWidth
          style={{ marginTop: 12 }}
          disabled={!url.trim() || loading}
        />

        <Button
          title={t('profile.disconnectServer')}
          variant="danger"
          fullWidth
          onPress={handleDisconnect}
          style={{ marginTop: 24 }}
        />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (Colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.marginMobile,
    paddingBottom: Spacing.gutter,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});
