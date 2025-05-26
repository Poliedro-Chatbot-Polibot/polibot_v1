import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./auth.styles";

import { useSession } from "@/src/hooks/auth";
import config from "@/src/utils/config";
import axios from 'axios';
import { router } from "expo-router";


interface Form {
  username: string;
  password: string;
}

export default function SignIn() {
  const { signIn } = useSession();


  const [form, setForm] = useState<Form>({
    username: '',
    password: ''
  });

  const handleSubmit = async () => {
    const { username, password } = form;

    if (!username || !password) {
      Alert.alert('Formulario invalido!',
        `Campo ${!username ? 'USERNAME' : 'SENHA'} nao preenchido.`
      )
      return;
    } else {
      await axios(`${config.apiUrl}/auth/v1/login/`,{
        method:'POST',
        data: form
      }).then((res)=>{
        signIn(res.data);
        router.replace('/');
      }).catch((err)=> {
        Alert.alert('ERRO','Erro ao realizar o login');        
      })
    }
  }
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Bem-Vindo(a)!</Text>
        <Text style={styles.subtitle}>PoliBot Gooooooot</Text>
      </View>
      <View style={{ gap: 10 }}>
        <TextInput
          style={{ borderWidth: 1, borderRadius: 20, padding: 14, borderColor: '#424242' }}
          placeholder="Username"
          onChangeText={(text) => setForm(e => ({ ...e, username: text }))}
          value={form.username}
        ></TextInput>
        <TextInput
          style={{ borderWidth: 1, borderRadius: 20, padding: 14, borderColor: '#424242' }}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setForm(e => ({ ...e, password: text }))}
          value={form.password}
        ></TextInput>
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        style={{ borderWidth: 1, borderRadius: 20, padding: 10, borderColor: '#424242', alignItems: 'center', backgroundColor: '#595151' }}>
        <Text style={{ color: 'white' }}>Logar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{alignItems:'center'}} onPress={()=>router.replace('/(auth)/sign-up')}>
        <Text>Nao possui uma conta? Registrar-se</Text>
      </TouchableOpacity>
    </View>
  )
}