import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { Loading } from '../../components/ui/Loading';

const dashyLogo = require('../../../assets/icon.png');

export const SplashScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(246, 222, 205, 0.4)', Colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Image source={dashyLogo} style={styles.logo} />
        <Loading message={t('auth.startingDashy')} />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (Colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 24,
  },
});
