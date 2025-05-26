import { useFonts } from 'expo-font';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import 'react-native-reanimated';
import RootNavigator from '../components/RootNavigator';
import { SplashScreenController } from '../components/SplashScreenController';
import { SessionProvider } from '../hooks/auth';




export default function RootLayout() {

    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        return <Text>Carregando...</Text>;
    }

    return (
        <SessionProvider>
            <SplashScreenController />
            <RootNavigator />
        </SessionProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#023047',
    },
    text: {
        color: 'white',
    },
});
