import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Spacing } from '../../theme/tokens';
import { useColors, useTheme } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { User } from '../../types/api';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';
import { changeAppLanguage, SUPPORTED_LANGUAGES } from '../../i18n/config';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import * as profileApi from '../../api/profile';

const LANGUAGES = SUPPORTED_LANGUAGES;
const LANG_LABELS: Record<string, string> = {
  en: 'EN', fr: 'FR', es: 'ES', de: 'DE', it: 'IT', zh: 'ZH', ru: 'RU',
};
const THEME_KEYS: User['theme'][] = ['light', 'dark', 'violet', 'glass'];
const THEME_I18N_KEYS: Record<string, string> = {
  light: 'profile.theme_light',
  dark: 'profile.theme_dark',
  violet: 'profile.theme_violet',
  glass: 'profile.theme_glass',
};
const DATE_FORMATS: Array<{ key: User['dateFormat']; i18nKey: string }> = [
  { key: '', i18nKey: 'profile.date_none' },
  { key: 'dmy', i18nKey: 'profile.date_dmy' },
  { key: 'mdy', i18nKey: 'profile.date_mdy' },
  { key: 'iso', i18nKey: 'profile.date_iso' },
];

export const EditProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const { applyTheme } = useTheme();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation();
  const { user } = useAuth();
  const { updateUser } = useSync();
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle ?? '');
  const [timezone, setTimezone] = useState(user?.timezone ?? '');
  const [language, setLanguage] = useState(user?.language ?? 'en');
  const [theme, setTheme] = useState(user?.theme ?? 'light');
  const [dateFormat, setDateFormat] = useState(user?.dateFormat ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload: profileApi.ProfileUpdatePayload = {};
      if (nickname !== user?.nickname) payload.nickname = nickname;
      if (fullName !== user?.fullName) payload.fullName = fullName;
      if (jobTitle !== user?.jobTitle) payload.jobTitle = jobTitle;
      if (timezone !== user?.timezone) payload.timezone = timezone;
      if (language !== user?.language) payload.language = language as any;
      if (theme !== user?.theme) payload.theme = (theme === 'glass' ? 'image' : theme) as any;
      if (dateFormat !== user?.dateFormat) payload.dateFormat = dateFormat as any;

      if (Object.keys(payload).length === 0) {
        navigation.goBack();
        return;
      }

      const { user: updated } = await profileApi.updateProfile(payload);
      updateUser(updated);
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.failedUpdateProfile'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={['rgba(246, 222, 205, 0.4)', Colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
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
            <Button
              title={t('common.cancel')}
              variant="ghost"
              size="small"
              onPress={() => navigation.goBack()}
            />
            <Text variant="headlinePage" color={Colors.onSurface}>{t('profile.editProfile')}</Text>
            <View style={{ width: 60 }} />
          </View>

          <Input
            value={nickname}
            onChangeText={setNickname}
            placeholder={t('profile.nicknamePlaceholder')}
            containerStyle={styles.input}
            leftIcon={<Icon name="person" size={20} color={Colors.outline} />}
          />

          <Input
            value={fullName}
            onChangeText={setFullName}
            placeholder={t('profile.fullNamePlaceholder')}
            containerStyle={styles.input}
            leftIcon={<Icon name="badge" size={20} color={Colors.outline} />}
          />

          <Input
            value={jobTitle}
            onChangeText={setJobTitle}
            placeholder={t('profile.jobTitlePlaceholder')}
            containerStyle={styles.input}
            leftIcon={<Icon name="work" size={20} color={Colors.outline} />}
          />

          <Input
            value={timezone}
            onChangeText={setTimezone}
            placeholder={t('profile.timezonePlaceholder')}
            containerStyle={styles.input}
            leftIcon={<Icon name="schedule" size={20} color={Colors.outline} />}
          />

          <Text variant="labelCaps" color={Colors.outline} style={{ marginTop: 8, marginBottom: 8 }}>
            {t('profile.language')}
          </Text>
          <View style={styles.chipRow}>
            {LANGUAGES.map((lang) => (
              <Chip
                key={lang}
                label={LANG_LABELS[lang] ?? lang.toUpperCase()}
                selected={language === lang}
                onPress={() => {
                  setLanguage(lang);
                  changeAppLanguage(lang);
                }}
              />
            ))}
          </View>

          <Text variant="labelCaps" color={Colors.outline} style={{ marginTop: 16, marginBottom: 8 }}>
            {t('profile.theme')}
          </Text>
          <View style={styles.chipRow}>
            {THEME_KEYS.map((tk) => (
              <Chip
                key={tk}
                label={t(THEME_I18N_KEYS[tk])}
                selected={theme === tk}
                onPress={() => {
                  setTheme(tk);
                  applyTheme(tk as User['theme']);
                }}
              />
            ))}
          </View>

          <Text variant="labelCaps" color={Colors.outline} style={{ marginTop: 16, marginBottom: 8 }}>
            {t('profile.dateFormat')}
          </Text>
          <View style={styles.chipRow}>
            {DATE_FORMATS.map((df) => (
              <Chip
                key={df.key || 'auto'}
                label={t(df.i18nKey)}
                selected={dateFormat === df.key}
                onPress={() => setDateFormat(df.key)}
              />
            ))}
          </View>

          {error && (
            <View style={styles.errorRow}>
              <Icon name="error" size={18} color={Colors.error} />
              <Text variant="bodyBase" color={Colors.error} style={{ marginLeft: 8 }}>
                {error}
              </Text>
            </View>
          )}

          <Button
            title={loading ? t('common.saving') : t('profile.save')}
            onPress={handleSave}
            fullWidth
            style={{ marginTop: 16 }}
            disabled={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      title={label}
      variant={selected ? 'primary' : 'secondary'}
      onPress={onPress}
      style={{ marginRight: 8, marginBottom: 8 }}
      size="small"
    />
  );
}

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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});
