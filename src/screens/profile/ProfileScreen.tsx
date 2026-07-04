import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Radius, Spacing } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useImageAuth } from '../../hooks/useImageAuth';
import { SettingsStackParamList } from '../../navigation/SettingsStackNavigator';

interface MenuItemProps {
  icon: React.ComponentProps<typeof Icon>['name'];
  label: string;
  onPress: () => void;
  danger?: boolean;
}

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  const { user, logout } = useAuth();
  const { sync } = useSync();
  const avatarSource = useImageAuth(user?.hasAvatar ? '/api/mobile/v1/avatar' : null);

  const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress, danger }) => {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Icon name={icon} size={22} color={danger ? Colors.error : Colors.onSurfaceVariant} />
          </View>
          <Text variant="bodyBold" color={danger ? Colors.error : Colors.onSurface}>
            {label}
          </Text>
          <View style={{ marginLeft: 'auto' }}>
            <Icon name="chevron-right" size={20} color={Colors.outline} />
          </View>
        </View>
      </TouchableOpacity>
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

      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader title={t('profile.settings')} />

        <Card padding="lg" style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Avatar
              source={avatarSource}
              initials={(user?.nickname || user?.email || 'U').slice(0, 2)}
              size={96}
            />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text variant="headlineSection" color={Colors.onSurface}>
                {user?.nickname || user?.fullName || user?.email}
              </Text>
              <Text variant="bodyBase" color={Colors.onSurfaceVariant}>
                {user?.email}
              </Text>
              {user?.role && <Badge label={user.role} variant="primary" style={{ marginTop: 6 }} />}
            </View>
          </View>
        </Card>

        <Card padding="md" style={styles.menuCard}>
          <MenuItem
            icon="person"
            label={t('profile.editProfile')}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <MenuItem
            icon="devices"
            label={t('profile.connectedDevices')}
            onPress={() => navigation.navigate('Sessions')}
          />
          <MenuItem
            icon="dns"
            label={t('profile.serverConnection')}
            onPress={() => navigation.navigate('ServerSettings')}
          />
        </Card>

        <View style={{ marginTop: Spacing.gutter }}>
          <Button
            title={t('common.logout')}
            variant="danger"
            fullWidth
            onPress={logout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (Colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Spacing.marginMobile,
    paddingBottom: Spacing.gutter,
  },
  profileCard: {
    marginBottom: Spacing.gutter,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuCard: {
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(224, 192, 180, 0.3)',
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});
