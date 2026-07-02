import React, { useEffect } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

const BASE_DELAY = 50;
const DURATION = 500;

export const AnimatedFadeIn: React.FC<Props> = ({
  children,
  index = 0,
  delay,
  style,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  const finalDelay = delay ?? index * BASE_DELAY;

  useEffect(() => {
    opacity.value = withDelay(
      finalDelay,
      withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) }),
    );
    translateY.value = withDelay(
      finalDelay,
      withTiming(0, { duration: DURATION, easing: Easing.out(Easing.cubic) }),
    );
  }, [opacity, translateY, finalDelay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
};
