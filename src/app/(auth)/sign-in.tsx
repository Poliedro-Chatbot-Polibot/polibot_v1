import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { useSession } from "@/src/hooks/auth";
import config from "@/src/utils/config";
import axios from "axios";
import { router } from "expo-router";
import styles from "./auth.styles";

interface Form {
  username: string;
  password: string;
}

export default function SignIn() {
  const { signIn } = useSession();
  const [form, setForm] = useState<Form>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const { username, password } = form;
    if (!username || !password) {
      Alert.alert("Formulário inválido!", `Preencha o ${!username ? "usuário" : "senha"}.`);
      return;
    }
    setLoading(true);
    try {
      const res = await axios(`${config.apiUrl}/auth/login/`, {
        method: "POST",
        data: form,
      });
      signIn(res.data);
      router.replace("/");
    } catch {
      Alert.alert("Erro", "Não foi possível logar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#1f2937", "#111827"]}
      style={styles.containerGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.headerContainer}
        >
          <Text style={styles.title}>PoliBot</Text>
          <Text style={styles.subtitle}>Bem-vindo de volta</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(400).delay(150)}
          style={styles.formContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Usuário"
            placeholderTextColor="#6b7280"
            onChangeText={(t) => setForm((f) => ({ ...f, username: t }))}
            value={form.username}
            autoCapitalize="none"
          />
          <View style={styles.separator} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#6b7280"
            secureTextEntry
            onChangeText={(t) => setForm((f) => ({ ...f, password: t }))}
            value={form.password}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.button,
              loading && { opacity: 0.7 }
            ]}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.buttonText}>Entrar</Text>
            }
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={styles.signUpTextContainer}
          onPress={() => router.replace("/(auth)/sign-up")}
          disabled={loading}
        >
          <Text style={[styles.signUpText,{ fontFamily: 'Poppins_400Regular' }]}>
            Não tem conta?{" "}
            <Text style={styles.signUpTextBold}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
