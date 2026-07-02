import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  withTiming,
} from 'react-native-reanimated';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { DashboardHomeScreen } from '../screens/dashboard/DashboardHomeScreen';
import { DashboardAppsScreen } from '../screens/dashboard/DashboardAppsScreen';
import { DashboardNotificationsScreen } from '../screens/dashboard/DashboardNotificationsScreen';
import { DashboardChatScreen } from '../screens/dashboard/DashboardChatScreen';
import { useSync } from '../context/SyncContext';
import { Icon } from '../components/ui/Icon';
import { useColors, useTheme } from '../theme/ThemeContext';
import { Radius, Spacing } from '../theme/tokens';

export type DashboardTabParamList = {
  Home: undefined;
  Apps: undefined;
  Notifications: undefined;
  Chat: undefined;
};

const Tab = createBottomTabNavigator<DashboardTabParamList>();

const TAB_ICONS: Record<keyof DashboardTabParamList, React.ComponentProps<typeof Icon>['name']> = {
  Home: 'home',
  Apps: 'apps',
  Notifications: 'notifications',
  Chat: 'chat',
};

const AnimatedView = Animated.View;

function AnimatedTabItem({
  isFocused,
  iconName,
  activeColor,
  inactiveColor,
  bgColor,
  showBadge,
  badgeColor,
  onPress,
}: {
  isFocused: boolean;
  iconName: React.ComponentProps<typeof Icon>['name'];
  activeColor: string;
  inactiveColor: string;
  bgColor: string;
  showBadge: boolean;
  badgeColor: string;
  onPress: () => void;
}) {
  const focused = useSharedValue(isFocused ? 1 : 0);
  const pressed = useSharedValue(0);

  useEffect(() => {
    focused.value = withSpring(isFocused ? 1 : 0, {
      stiffness: 700,
      damping: 32,
    });
  }, [isFocused]);

  const bgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(focused.value, [0, 1], [0, 1]) }],
    opacity: interpolate(focused.value, [0, 1], [0, 1]),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(focused.value, [0, 1], [1, 1.1]) },
      { translateY: interpolate(pressed.value, [0, 1], [0, -2]) },
    ],
  }));

  const handlePressIn = () => {
    pressed.value = withSpring(1, { stiffness: 400, damping: 10 });
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, { stiffness: 400, damping: 10 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
      android_ripple={{ color: 'transparent', borderless: true }}
    >
      <View style={styles.iconWrap}>
        <AnimatedView style={[styles.iconBg, bgStyle, { backgroundColor: bgColor }]} />
        <AnimatedView style={[styles.iconContent, iconStyle]}>
          <Icon
            name={iconName}
            size={22}
            color={isFocused ? activeColor : inactiveColor}
          />
          {showBadge && (
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <View style={styles.badgeInner} />
            </View>
          )}
        </AnimatedView>
      </View>
    </Pressable>
  );
}

function FloatingTabBar({ state, navigation }: any) {
  const Colors = useColors();
  const { isGlass } = useTheme();
  const { sync } = useSync();
  const unreadCount = sync?.notifications?.length ?? 0;

  const handlePress = (index: number, isFocused: boolean) => {
    if (!isFocused) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      navigation.navigate(state.routeNames[index]);
    }
  };

  const renderItems = () => (
    <View style={styles.itemsRow}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const name = state.routeNames[index] as keyof DashboardTabParamList;
        const iconName = TAB_ICONS[name];
        const showBadge = name === 'Notifications' && unreadCount > 0;

        return (
          <AnimatedTabItem
            key={route.key}
            isFocused={isFocused}
            iconName={iconName}
            activeColor={Colors.onPrimaryContainer}
            inactiveColor={Colors.onSurfaceVariant}
            bgColor={Colors.primaryContainer}
            showBadge={showBadge}
            badgeColor={Colors.error}
            onPress={() => handlePress(index, isFocused)}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.barContainer}>
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={isGlass ? 40 : 70}
            tint="light"
            style={[styles.blur, { borderRadius: Radius.xl }]}
          >
            {renderItems()}
          </BlurView>
        ) : (
          <View
            style={[
              styles.blur,
              {
                borderRadius: Radius.xl,
                backgroundColor: Colors.surfaceContainerLowest,
              },
            ]}
          >
            {renderItems()}
          </View>
        )}
      </View>
    </View>
  );
}

export const DashboardTabNavigator: React.FC = () => {
  const Colors = useColors();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        sceneStyle: { paddingBottom: 90, backgroundColor: Colors.background },
      }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={DashboardHomeScreen} />
      <Tab.Screen name="Apps" component={DashboardAppsScreen} />
      <Tab.Screen name="Notifications" component={DashboardNotificationsScreen} />
      <Tab.Screen name="Chat" component={DashboardChatScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  barContainer: {
    borderRadius: Radius.xl,
    shadowColor: 'rgba(95, 60, 35, 0.35)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  blur: {
    paddingHorizontal: Spacing.gutter,
    paddingVertical: 10,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBg: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: Radius.full,
  },
  iconContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  badgeInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignSelf: 'center',
    marginTop: 1,
  },
});