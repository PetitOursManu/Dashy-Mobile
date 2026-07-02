import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Spacing } from '../../theme/tokens';
import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { useAuth } from '../../context/AuthContext';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useColors } from '../../theme/ThemeContext';

export const SecurityScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const navigation = useNavigation<NativeStackNavigationProp<DrawerParamList>>();
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={['rgba(246, 222, 205, 0.4)', Colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader title={t('security.title')} />

        <Card padding="md" style={styles.card}>
          <View style={styles.row}>
            <Icon name="verified-user" size={24} color={Colors.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text variant="bodyBold" color={Colors.onSurface}>{t('security.twoFactor')}</Text>
              <Text variant="bodyBase" color={Colors.onSurfaceVariant}>
                {user?.twoFactorEnabled
                  ? t('security.disable2FADescription')
                  : t('security.enable2FADescription')}
              </Text>
            </View>
          </View>
        </Card>

        <Card padding="md" style={styles.card}>
          <View style={styles.row}>
            <Icon name="devices" size={24} color={Colors.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text variant="bodyBold" color={Colors.onSurface}>{t('security.activeSessions')}</Text>
              <Text variant="bodyBase" color={Colors.onSurfaceVariant}>
                {t('security.manageSessions')}
              </Text>
            </View>
          </View>
          <Button
            title={t('security.viewSessions')}
            variant="secondary"
            size="small"
            onPress={() => navigation.navigate('Settings', { screen: 'Sessions', params: { returnTo: 'Security' } })}
            style={{ marginTop: 12 }}
          />
        </Card>

        <Button
          title={t('common.logout')}
          variant="danger"
          fullWidth
          onPress={logout}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.marginMobile,
    paddingBottom: Spacing.gutter,
  },
  card: {
    marginBottom: Spacing.gutter,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
