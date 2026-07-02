import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RequestsScreen } from './RequestsScreen';
import { NewRequestScreen } from './NewRequestScreen';

export type RequestsStackParamList = {
  RequestsList: undefined;
  NewRequest: undefined;
};

const Stack = createNativeStackNavigator<RequestsStackParamList>();

export const RequestsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="RequestsList" component={RequestsScreen} />
      <Stack.Screen name="NewRequest" component={NewRequestScreen} />
    </Stack.Navigator>
  );
};
