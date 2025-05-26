import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './home.styles';


import { useSession } from '@/src/hooks/auth';
import { router } from 'expo-router';

export default function App() {
    const {signOut,session} = useSession();

    const data = JSON.parse(session || '');


    const logout = () => {
        signOut();
        router.navigate('/(auth)/sign-in');
    }
    console.log(data.user)



    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Bem-Vindo(a) {data.user.first_name} {data.user.last_name} !</Text>
            <TouchableOpacity onPress={logout} style={{borderWidth:1,padding: 3, alignItems:'center',borderRadius: 10}}>
                <Text>Sair</Text>
            </TouchableOpacity>
        </View>
    );
};
