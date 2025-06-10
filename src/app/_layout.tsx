import { Poppins_400Regular, Poppins_600SemiBold, useFonts as usePoppins } from '@expo-google-fonts/poppins';
import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

import RootNavigator from '../components/RootNavigator';
import { SplashScreenController } from '../components/SplashScreenController';
import { SessionProvider } from '../hooks/auth';


import { ThemeProvider } from '@rneui/themed';

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

         <View style={styles.centered}><ActivityIndicator size="large" color="#22c55e" /></View>;
      </View>
    );
  }


  return (
    <SessionProvider>
      <ThemeProvider>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor} />
          <SplashScreenController />
          <RootNavigator />
        </View>
      </ThemeProvider>
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
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0f172a' 
  },
});
