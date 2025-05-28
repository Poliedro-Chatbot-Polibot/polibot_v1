import { Poppins_400Regular, Poppins_600SemiBold, useFonts as usePoppins } from '@expo-google-fonts/poppins';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

import RootNavigator from '../components/RootNavigator';
import { SplashScreenController } from '../components/SplashScreenController';
import { SessionProvider } from '../hooks/auth';

export default function RootLayout() {
  const [loaded] = usePoppins({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!loaded) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor} />
        <Text style={[styles.text, { fontFamily: 'Poppins_400Regular' }]}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <SessionProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor} />
        <SplashScreenController />
        <RootNavigator />
      </View>
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#023047',
  },
  text: {
    color: '#fff',
    alignSelf: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
