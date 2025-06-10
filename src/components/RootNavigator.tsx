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
  const dataSession = JSON.parse(session || '{}');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={rootStyles.container}>
        <ThemeProvider value={DarkAppTheme}>
          <Stack screenOptions={{ animation: 'fade' }}>
            <Stack.Protected guard={Boolean(session)}>
              <Stack.Screen name="(app)/index" options={{ headerShown: false }} />
              <Stack.Screen name="(app)/pedidoCrud" options={{ headerShown: false }} />
              <Stack.Screen name="(app)/pedidoLista" options={{ headerShown: false }} />
              <Stack.Screen name="(user)/[id]" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={Boolean(dataSession['user']?.is_staff)}>
                <Stack.Screen name="(admin)/admin" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)/users/usersLista" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)/users/userCriar" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)/users/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)/produto/produtoLista" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)/produto/produtoCriar" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)/pedidos/pedidosLista" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)/produto/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)/produto/parte/parteLista" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)/produto/parte/parteCriar" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)/produto/parte/[id]" options={{ headerShown: false }} />
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
