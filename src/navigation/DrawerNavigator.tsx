import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { DashboardTabNavigator } from './DashboardTabNavigator';
import { SettingsStackNavigator } from './SettingsStackNavigator';
import { StoreStackNavigator } from './StoreStackNavigator';
import { UsersStackNavigator } from './UsersStackNavigator';
import { RequestsStackNavigator } from '../screens/requests/RequestsStackNavigator';
import { SecurityScreen } from '../screens/security/SecurityScreen';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { useSync } from '../context/SyncContext';
import { Icon } from '../components/ui/Icon';
import { Text } from '../components/ui/Text';
import { Avatar } from '../components/ui/Avatar';
import { useImageAuth } from '../hooks/useImageAuth';
import { useColors } from '../theme/ThemeContext';
import { Radius, Spacing } from '../theme/tokens';

import type { NavigatorScreenParams } from '@react-navigation/native';
import { SettingsStackParamList } from './SettingsStackNavigator';

export type DrawerParamList = {
  Dashboard: undefined;
  Store: undefined;
  Users: undefined;
  Requests: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
  Security: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

interface DrawerItemDef {
  name: keyof DrawerParamList;
  labelKey: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  admin?: boolean;
  requiresStore?: boolean;
}

const DRAWER_ITEMS: DrawerItemDef[] = [
  { name: 'Dashboard', labelKey: 'navigation.dashboard', icon: 'dashboard' },
  { name: 'Store', labelKey: 'navigation.store', icon: 'storefront', admin: true, requiresStore: true },
  { name: 'Users', labelKey: 'navigation.users', icon: 'people', admin: true },
  { name: 'Requests', labelKey: 'navigation.requests', icon: 'list-alt', admin: true },
  { name: 'Settings', labelKey: 'navigation.settings', icon: 'settings' },
  { name: 'Security', labelKey: 'navigation.security', icon: 'security' },
];

function DrawerItem({
  item,
  focused,
  onPress,
}: {
  item: DrawerItemDef;
  focused: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const Colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.item,
        focused && {
          backgroundColor: Colors.primaryContainer,
        },
      ]}
    >
      <Icon
        name={item.icon}
        size={22}
        color={focused ? Colors.onPrimary : Colors.onSurface}
      />
      <Text
        variant="bodyBase"
        color={focused ? Colors.onPrimary : Colors.onSurface}
        style={{ marginLeft: 12 }}
      >
        {t(item.labelKey)}
      </Text>
    </TouchableOpacity>
  );
}

const DrawerContent = React.memo(function DrawerContent(props: DrawerContentComponentProps) {
  const { t } = useTranslation();
  const Colors = useColors();
  const { logout, user } = useAuth();
  const { isStaff } = useSync();
  const { serverInfo } = useServer();
  const avatarSource = useImageAuth(user?.hasAvatar ? '/api/mobile/v1/avatar' : null);
  const activeRoute = props.state.routes[props.state.index].name as keyof DrawerParamList;

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    await logout();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[styles.container, { backgroundColor: Colors.surfaceContainerLowest }]}
    >
      <View style={styles.header}>
        <Avatar
          uri={avatarSource?.uri}
          initials={(user?.nickname || user?.email || 'U').slice(0, 2)}
          size={56}
        />
        <Text variant="headlineSection" color={Colors.onSurface} style={{ marginTop: 12 }}>
          {user?.nickname || user?.email || t('common.user')}
        </Text>
        <Text variant="bodyBase" color={Colors.onSurfaceVariant}>
          {user?.role || 'Dashy'}
        </Text>
      </View>

      <View style={styles.divider} />

      {DRAWER_ITEMS.map((item) => {
        if (item.admin && !isStaff) return null;
        if (item.requiresStore && !serverInfo?.features?.store) return null;
        return (
          <DrawerItem
            key={item.name}
            item={item}
            focused={activeRoute === item.name}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              props.navigation.navigate(item.name);
              props.navigation.dispatch(DrawerActions.closeDrawer());
            }}
          />
        );
      })}

      <View style={{ flex: 1 }} />

      <View style={styles.divider} />

      <TouchableOpacity onPress={handleLogout} style={styles.item}>
        <Icon name="logout" size={22} color={Colors.error} />
        <Text variant="bodyBase" color={Colors.error} style={{ marginLeft: 12 }}>
          {t('common.logout')}
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
});

export const DrawerNavigator: React.FC = () => {
  const Colors = useColors();
  const { isStaff } = useSync();
  const { serverInfo } = useServer();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'rgba(28, 28, 26, 0.4)',
        drawerStyle: {
          width: 280,
          backgroundColor: Colors.surfaceContainerLowest,
        },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardTabNavigator} />
      {isStaff && serverInfo?.features?.store && (
        <Drawer.Screen name="Store" component={StoreStackNavigator} />
      )}
      {isStaff && <Drawer.Screen name="Users" component={UsersStackNavigator} />}
      {isStaff && <Drawer.Screen name="Requests" component={RequestsStackNavigator} />}
      <Drawer.Screen name="Settings" component={SettingsStackNavigator} />
      <Drawer.Screen name="Security" component={SecurityScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.marginMobile,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(140, 113, 103, 0.2)',
    marginVertical: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    marginBottom: 4,
  },
});
