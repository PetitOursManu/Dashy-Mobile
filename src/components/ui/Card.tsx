import React from 'react';
import {
  View,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Radius, Shadows } from '../../theme/tokens';
import { useColors, useTheme } from '../../theme/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 20,
};

export const Card: React.FC<CardProps> = ({
  children,
  style,
  contentStyle,
  padding = 'md',
}) => {
  const Colors = useColors();
  const { isGlass } = useTheme();

  const content = (
    <View
      style={[
        {
          borderRadius: Radius.xl,
          overflow: 'hidden',
          padding: paddingMap[padding],
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  const cardStyle = {
    borderRadius: Radius.xl,
    overflow: 'hidden' as const,
    backgroundColor: isGlass ? 'rgba(255, 255, 255, 0.55)' : Colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: isGlass ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.6)',
    borderLeftColor: isGlass ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.6)',
    ...Shadows.ambientCard,
  };

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={isGlass ? 40 : 60}
        tint="light"
        style={[cardStyle, style]}
      >
        {content}
      </BlurView>
    );
  }

  return <View style={[cardStyle, style]}>{content}</View>;
};

interface PressableCardProps extends Omit<TouchableOpacityProps, 'children'>, CardProps {}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const PressableCard: React.FC<PressableCardProps> = ({
  children,
  style,
  contentStyle,
  padding = 'md',
  ...touchableProps
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      activeOpacity={0.9}
      onPressIn={() => {
        scale.value = withSpring(1.02, { stiffness: 400, damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { stiffness: 400, damping: 15 });
      }}
      {...touchableProps}
    >
      <Animated.View style={animatedStyle}>
        <Card style={style} contentStyle={contentStyle} padding={padding}>
          {children}
        </Card>
      </Animated.View>
    </AnimatedTouchable>
  );
};
