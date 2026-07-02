import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useServer } from '../context/ServerContext';

export function useResetToOnboarding(): () => void {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { clearServerUrl } = useServer();

  return async () => {
    await clearServerUrl();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };
}
