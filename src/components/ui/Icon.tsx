import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '../../theme/ThemeContext';

export type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  fill?: boolean;
}

export const Icon: React.FC<Props> = ({
  name,
  size = 24,
  color,
}) => {
  const Colors = useColors();
  return (
    <MaterialIcons
      name={name}
      size={size}
      color={color ?? Colors.onSurface}
      style={{ lineHeight: size }}
    />
  );
};
