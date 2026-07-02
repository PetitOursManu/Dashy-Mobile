import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColors } from '../../theme/ThemeContext';
import { Text } from './Text';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props extends TouchableOpacityProps {
  title: string;
  variant?: Variant;
  fullWidth?: boolean;
  size?: 'default' | 'small';
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<Props> = ({
  title,
  variant = 'primary',
  fullWidth = false,
  size = 'default',
  style,
  ...rest
}) => {
  const Colors = useColors();
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { stiffness: 400, damping: 15 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 400, damping: 15 });
  };

  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        activeOpacity={0.85}
        style={[{ alignSelf: fullWidth ? 'stretch' : 'flex-start' }, style]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...rest}
      >
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={[Colors.primaryContainer, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 12,
              paddingHorizontal: size === 'small' ? 16 : 24,
              paddingVertical: size === 'small' ? 8 : 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text variant="bodyBold" color={Colors.onPrimary}>{title}</Text>
          </LinearGradient>
        </Animated.View>
      </AnimatedTouchable>
    );
  }

  const bgColors: Record<Exclude<Variant, 'primary'>, string> = {
    secondary: 'rgba(255, 255, 255, 0.5)',
    ghost: 'transparent',
    danger: 'rgba(186, 26, 26, 0.08)',
  };

  const borderColors: Record<Exclude<Variant, 'primary'>, string> = {
    secondary: Colors.outlineVariant,
    ghost: 'transparent',
    danger: 'rgba(186, 26, 26, 0.2)',
  };

  const textColors: Record<Exclude<Variant, 'primary'>, string> = {
    secondary: Colors.onSurface,
    ghost: Colors.primary,
    danger: Colors.error,
  };

  return (
    <AnimatedTouchable
      activeOpacity={0.85}
      style={[
        {
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          backgroundColor: bgColors[variant],
          borderRadius: 12,
          borderWidth: 1,
          borderColor: borderColors[variant],
          paddingHorizontal: size === 'small' ? 16 : 24,
          paddingVertical: size === 'small' ? 8 : 12,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      <Animated.View style={animatedStyle}>
        <Text variant="bodyBold" color={textColors[variant]}>{title}</Text>
      </Animated.View>
    </AnimatedTouchable>
  );
};
