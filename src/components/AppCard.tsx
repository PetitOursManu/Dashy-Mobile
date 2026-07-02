import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { App } from '../types/api';
import { Radius, Spacing, Typography } from '../theme/tokens';
import { useColors } from '../theme/ThemeContext';
import { ColorPalette } from '../theme/colors';
import { Card } from './ui/Card';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { Badge } from './ui/Badge';
import { useImageAuth } from '../hooks/useImageAuth';
import { useSync } from '../context/SyncContext';
import { RootStackParamList } from '../navigation/RootNavigator';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface Props {
  app: App;
}

export const AppCard: React.FC<Props> = ({ app }) => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const { toggleFavorite } = useSync();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const previewSource = useImageAuth(app.previewUrl);
  const iconName = app.category ? 'apps' : 'widgets';
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(1.03, { stiffness: 400, damping: 17 });
    translateY.value = withSpring(-2, { stiffness: 400, damping: 17 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 400, damping: 17 });
    translateY.value = withSpring(0, { stiffness: 400, damping: 17 });
  };

  const handleOpen = async () => {
    const external = app.externalUrl || app.share?.url;
    if (external) {
      await Linking.openURL(external);
      return;
    }
    if (app.url) {
      navigation.navigate('WebView', { url: app.url, title: app.name });
    }
  };

  return (
    <AnimatedTouchable
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleOpen}
    >
      <Animated.View style={[animatedStyle, styles.animatedContainer]}>
        <Card style={styles.card} padding="md">
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              {previewSource ? (
                <Image source={previewSource} style={styles.preview} contentFit="cover" />
              ) : (
                <Icon name={iconName} size={28} color={Colors.primary} />
              )}
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggleFavorite(app.id)}
              style={styles.favoriteBtn}
            >
              <Icon
                name={app.isFavorite ? 'favorite' : 'favorite-border'}
                size={22}
                color={app.isFavorite ? Colors.primary : Colors.outline}
              />
            </TouchableOpacity>
          </View>

          <Text variant="bodyBold" color={Colors.onSurface} numberOfLines={1} style={{ marginTop: 8 }}>
            {app.name}
          </Text>
          <Text variant="bodyBase" color={Colors.onSurfaceVariant} numberOfLines={2} style={{ marginTop: 2 }}>
            {app.description || t('app.noDescription')}
          </Text>

          <View style={styles.footer}>
            {app.category && <Badge label={app.category} variant="secondary" />}
            <TouchableOpacity activeOpacity={0.8} onPress={handleOpen}>
              <LinearGradient
                colors={[Colors.primaryContainer, Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.openBtn}
              >
                <Text variant="bodyBold" color={Colors.onPrimary}>
                  {app.externalUrl || app.share?.url ? t('app.open') : t('app.view')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Card>
      </Animated.View>
    </AnimatedTouchable>
  );
};

const getStyles = (Colors: ColorPalette) => StyleSheet.create({
  animatedContainer: {
    flex: 1,
    minWidth: 140,
    maxWidth: '100%',
    marginBottom: Spacing.gutter,
  },
  card: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  preview: {
    width: 48,
    height: 48,
  },
  favoriteBtn: {
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(224, 192, 180, 0.4)',
  },
  openBtn: {
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});
