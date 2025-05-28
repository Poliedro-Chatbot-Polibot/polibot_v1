import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '../hooks/auth';
import rootStyles from './root.styles';


const DarkAppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#023047', 
    card: '#023047',       
    text: '#ffffff',       
    border: 'transparent', 
  },
};

export default function RootNavigator() {
  const { session } = useSession();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={rootStyles.container}>
        <ThemeProvider value={DarkAppTheme}>
          <Stack screenOptions={{ animation: 'simple_push' }}>
            <Stack.Protected guard={Boolean(session)}>
              <Stack.Screen name="(app)/index" options={{ headerShown: false }} />
              <Stack.Screen name="(app)/pedido" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={!session}>
              <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
