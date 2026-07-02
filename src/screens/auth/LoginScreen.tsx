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
import { Radius, Spacing } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useAuth } from '../../context/AuthContext';
import { DebugPanel } from '../../components/DebugPanel';
import { getDeviceName } from '../../utils/deviceName';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import { useResetToOnboarding } from '../../hooks/useResetToOnboarding';

export const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const resetToOnboarding = useResetToOnboarding();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    setError(null);
    setLoading(true);
    try {
      const result = await login({
        email: email.trim(),
        password,
        device: getDeviceName(),
      });
      if (result.needs2fa) {
        navigation.navigate('TwoFactor', { pendingToken: result.pendingToken });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loginFailed'));
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
              <Icon name="widgets" size={32} color={Colors.onPrimary} />
            </View>
            <Text variant="displayLg" color={Colors.primary} style={{ marginTop: 16 }}>
              {t('auth.welcomeBack')}
            </Text>
            <Text variant="bodyBase" color={Colors.onSurfaceVariant} style={{ marginTop: 8 }}>
              {t('auth.signInToContinue')}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder={t('auth.emailPlaceholder')}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              leftIcon={<Icon name="person" size={20} color={Colors.outline} />}
              containerStyle={styles.input}
            />

            <Input
              value={password}
              onChangeText={setPassword}
              placeholder={t('auth.passwordPlaceholder')}
              secureTextEntry
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              leftIcon={<Icon name="lock" size={20} color={Colors.outline} />}
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
              title={loading ? t('auth.signingIn') : t('auth.signIn')}
              onPress={handleLogin}
              fullWidth
              style={{ marginTop: 8 }}
              disabled={!email.trim() || !password || loading}
            />

            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <Button
                title={t('auth.changeServerUrl')}
                variant="ghost"
                size="small"
                onPress={resetToOnboarding}
              />
            </View>

            <DebugPanel />
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
