import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { NoteScreen } from '../screens/profile/NoteScreen';
import { SessionsScreen } from '../screens/profile/SessionsScreen';
import { ServerSettingsScreen } from '../screens/profile/ServerSettingsScreen';

export type SettingsStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Note: { returnTo?: string } | undefined;
  Sessions: { returnTo?: string } | undefined;
  ServerSettings: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Note" component={NoteScreen} />
      <Stack.Screen name="Sessions" component={SessionsScreen} />
      <Stack.Screen name="ServerSettings" component={ServerSettingsScreen} />
    </Stack.Navigator>
  );
};
