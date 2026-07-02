import React, { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Radius, Spacing, Typography } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useAuth } from '../../context/AuthContext';
import { getDeviceName } from '../../utils/deviceName';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useResetToOnboarding } from '../../hooks/useResetToOnboarding';

export const TwoFactorScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const route = useRoute<RouteProp<AuthStackParamList, 'TwoFactor'>>();
  const { verify2FA } = useAuth();
  const resetToOnboarding = useResetToOnboarding();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) return;
    setError(null);
    setLoading(true);
    try {
      await verify2FA({
        pendingToken: route.params.pendingToken,
        token: code.trim(),
        device: getDeviceName(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.verificationFailed'));
    } finally {
      setLoading(false);
    }
  };

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
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Icon name="shield" size={32} color={Colors.onPrimary} />
            </View>
            <Text variant="displayLg" color={Colors.primary} style={{ marginTop: 16 }}>
              {t('auth.twoFactor')}
            </Text>
            <Text variant="bodyBase" color={Colors.onSurfaceVariant} style={{ marginTop: 8, textAlign: 'center' }}>
              {t('auth.enterCode')}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              value={code}
              onChangeText={setCode}
              placeholder={t('auth.codePlaceholder')}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleVerify}
              leftIcon={<Icon name="vpn-key" size={20} color={Colors.outline} />}
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
              title={loading ? t('auth.verifying') : t('auth.verify')}
              onPress={handleVerify}
              fullWidth
              style={{ marginTop: 8 }}
              disabled={!code.trim() || loading}
            />

            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <Button
                title={t('auth.useAnotherAccount')}
                variant="ghost"
                size="small"
                onPress={resetToOnboarding}
              />
            </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 72,
    height: 72,
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
});
