import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Spacing } from '../../theme/tokens';
import { SettingsStackParamList } from '../../navigation/SettingsStackNavigator';
import { useColors } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { useSync } from '../../context/SyncContext';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import * as profileApi from '../../api/profile';

export const NoteScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  const route = useRoute();
  const params = (route.params ?? {}) as { returnTo?: string };
  const { sync, updateNote } = useSync();
  const [content, setContent] = useState(sync?.note ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sync?.note) setContent(sync.note);
  }, [sync?.note]);

  const goBack = () => {
    if (params.returnTo) {
      if (navigation.canGoBack()) navigation.goBack();
      navigation.getParent()?.navigate(params.returnTo as never);
    } else {
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    try {
      const { content: saved } = await profileApi.updateNote(content);
      updateNote(saved);
      goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.failedSaveNote'));
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
              onPress={goBack}
            />
            <Text variant="headlinePage" color={Colors.onSurface}>{t('dashboard.note')}</Text>
            <View style={{ width: 60 }} />
          </View>

          <Text variant="bodyBase" color={Colors.onSurfaceVariant} style={{ marginBottom: 12 }}>
            {t('dashboard.noteHint')}
          </Text>

          <Input
            value={content}
            onChangeText={setContent}
            placeholder={t('dashboard.notePlaceholder')}
            multiline
            numberOfLines={12}
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
            title={loading ? t('common.saving') : t('dashboard.saveNote')}
            onPress={handleSave}
            fullWidth
            style={{ marginTop: 12 }}
            disabled={loading}
          />
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
