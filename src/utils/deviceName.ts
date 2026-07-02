import * as Device from 'expo-device';
import { Platform } from 'react-native';

export function getDeviceName(): string {
  const brand = Device.brand ?? Device.manufacturer ?? Platform.OS;
  const model = Device.modelName ?? Device.modelId ?? 'Mobile';
  return `${brand} ${model}`;
}
