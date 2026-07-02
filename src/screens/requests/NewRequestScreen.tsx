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
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Radius, Spacing } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useSync } from '../../context/SyncContext';
import * as requestsApi from '../../api/requests';

export const NewRequestScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation();
  const { addRequest } = useSync();
  const [kind, setKind] = useState<'idea' | 'file'>('idea');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const { request } = await requestsApi.createRequest({ kind, message: message.trim() });
      addRequest(request);
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('requests.failedSubmitRequest'));
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
          <ScreenHeader title={t('requests.newRequest')} />

          <View style={styles.kindRow}>
            <KindButton
              label={t('requests.kind_idea')}
              selected={kind === 'idea'}
              onPress={() => setKind('idea')}
            />
            <KindButton
              label={t('requests.kind_file')}
              selected={kind === 'file'}
              onPress={() => setKind('file')}
            />
          </View>

          <Input
            value={message}
            onChangeText={setMessage}
            placeholder={t('requests.messagePlaceholder')}
            multiline
            numberOfLines={6}
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
            title={loading ? t('common.submitting') : t('requests.submitRequest')}
            onPress={handleSubmit}
            fullWidth
            style={{ marginTop: 12 }}
            disabled={!message.trim() || loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

function KindButton({
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
      style={{ flex: 1, marginHorizontal: 4 }}
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
  kindRow: {
    flexDirection: 'row',
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
