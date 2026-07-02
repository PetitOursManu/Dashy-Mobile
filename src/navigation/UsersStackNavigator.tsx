import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UsersScreen } from '../screens/users/UsersScreen';

export type UsersStackParamList = {
  UsersList: undefined;
};

const Stack = createNativeStackNavigator<UsersStackParamList>();

export const UsersStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="UsersList" component={UsersScreen} />
    </Stack.Navigator>
  );
};
