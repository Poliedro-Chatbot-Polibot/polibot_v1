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

import config from "@/src/utils/config";
import axios from "axios";
import { router } from "expo-router";
import styles from "./auth.styles";

interface Form {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export default function SignUpScreen() {

  const [form, setForm] = useState<Form>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const { username, password } = form;
    if (!username || !password) {
      Alert.alert(
        "Formulário inválido!",
        `Preencha o ${!username ? "usuário" : "senha"}.`
      );
      return;
    }
    setLoading(true);
    try {
      await axios(`${config.apiUrl}/auth/register/`, {
        method: "POST",
        data: form,
      });
      router.replace("/(auth)/sign-in");
    } catch {
      Alert.alert("Erro", "Não foi possível registrar. Tente novamente.");
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
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Bem-vindo ao PoliBot</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(400).delay(150)}
          style={styles.formContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Usuário"
            placeholderTextColor="#6b7280"
            autoCapitalize="none"
            onChangeText={(t) => setForm((f) => ({ ...f, username: t }))}
            value={form.username}
          />
          <View style={styles.separator} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#6b7280"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(t) => setForm((f) => ({ ...f, email: t }))}
            value={form.email}
          />
          <View style={styles.separator} />
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#6b7280"
            onChangeText={(t) => setForm((f) => ({ ...f, first_name: t }))}
            value={form.first_name}
          />
          <View style={styles.separator} />
          <TextInput
            style={styles.input}
            placeholder="Sobrenome"
            placeholderTextColor="#6b7280"
            onChangeText={(t) => setForm((f) => ({ ...f, last_name: t }))}
            value={form.last_name}
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
            style={[styles.button, loading && { opacity: 0.7 }]}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Registrar-se</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={styles.signUpTextContainer}
          onPress={() => router.replace("/(auth)/sign-in")}
          disabled={loading}
        >
          <Text style={[styles.signUpText,{ fontFamily: 'Poppins_400Regular' }]}>
            Já tem conta?{" "}
            <Text style={styles.signUpTextBold}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
