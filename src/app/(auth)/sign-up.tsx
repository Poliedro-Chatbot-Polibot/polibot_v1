import { useSession } from "@/src/hooks/auth";
import config from "@/src/utils/config";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./auth.styles";

interface Form {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  
}

export default function SignUp() {
const { signIn } = useSession();


  const [form, setForm] = useState<Form>({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
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
      await axios(`${config.apiUrl}/auth/register`,{
        method:'POST',
        data: form
      }).then((res)=>{
        
        console.log(res.data)
        //signIn(res.data);
        router.replace('/(auth)/sign-in');
      }).catch((err)=> {
        Alert.alert('ERRO','Erro ao se registrar');
        console.log(err)        
      })
    }
  }
  return (
    <View style={styles.container}>
      <View style={{ gap: 10 }}>
        <TextInput
          style={{ borderWidth: 1, borderRadius: 20, padding: 14, borderColor: '#424242' }}
          placeholder="Username"
          onChangeText={(text) => setForm(e => ({ ...e, username: text }))}
          value={form.username}
        ></TextInput>
        <TextInput
          style={{ borderWidth: 1, borderRadius: 20, padding: 14, borderColor: '#424242' }}
          placeholder="E-mail"
          onChangeText={(text) => setForm(e => ({ ...e, email: text }))}
          value={form.email}
        ></TextInput>
        <TextInput
          style={{ borderWidth: 1, borderRadius: 20, padding: 14, borderColor: '#424242' }}
          placeholder="Nome"
          onChangeText={(text) => setForm(e => ({ ...e, first_name: text }))}
          value={form.first_name}
        ></TextInput>
        <TextInput
          style={{ borderWidth: 1, borderRadius: 20, padding: 14, borderColor: '#424242' }}
          placeholder="Sobrenome"
          onChangeText={(text) => setForm(e => ({ ...e, last_name: text }))}
          value={form.last_name}
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
        <Text style={{ color: 'white' }}>Registrar-se</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{alignItems:'center'}} onPress={()=>router.replace('/(auth)/sign-in')}>
        <Text>Ja possui cadastro? Logar</Text>
      </TouchableOpacity>
    </View>
  );
}