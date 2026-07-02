import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InstalledScreen } from '../screens/store/InstalledScreen';
import { CatalogScreen } from '../screens/store/CatalogScreen';
import { StatsScreen } from '../screens/admin/StatsScreen';

export type StoreStackParamList = {
  Installed: undefined;
  Catalog: undefined;
  Stats: undefined;
};

const Stack = createNativeStackNavigator<StoreStackParamList>();

export const StoreStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="Installed" component={InstalledScreen} />
      <Stack.Screen name="Catalog" component={CatalogScreen} />
      <Stack.Screen name="Stats" component={StatsScreen} />
    </Stack.Navigator>
  );
};
