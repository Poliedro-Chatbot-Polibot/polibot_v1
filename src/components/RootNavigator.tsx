import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styles from "../app/(app)/home.styles";
import { useSession } from "../hooks/auth";

export default function RootNavigator() {
    const { session } = useSession();
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ThemeProvider value={DefaultTheme}>
                    <Stack screenOptions={{
                        animation: 'simple_push'
                    }}>
                        <Stack.Protected guard={Boolean(session)}>
                            <Stack.Screen name="(app)/index" options={{ headerShown: false }} />
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
    )
}