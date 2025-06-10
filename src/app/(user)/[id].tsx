import { useSession } from "@/src/hooks/auth";
import { useStorageState } from "@/src/hooks/useStorageState";
import config from "@/src/utils/config";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles/profile.style';


interface UserData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

const formatApiError = (errorData: any): string => {
  if (!errorData) return "Ocorreu um erro desconhecido.";
  if (typeof errorData === 'string') return errorData;

  if (typeof errorData === 'object') {
    if (errorData.detail) return errorData.detail;

    const firstKey = Object.keys(errorData)[0];
    if (firstKey) {
      const message = Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : String(errorData[firstKey]);
      return `${firstKey.charAt(0).toUpperCase() + firstKey.slice(1)}: ${message}`;
    }
  }
  return "Não foi possível processar a resposta do servidor.";
};


export default function UserProfileScreen() {
  const [[], setSession] = useStorageState('session');
  const { session } = useSession();
  const data = JSON.parse(session || '{}');

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!data['access']) {
        setError("Sessão inválida.");
        setLoading(false);
        return;
      }
      try {
        const headers = { Authorization: `Bearer ${data['access']}` };
        const response = await fetch(`${config.apiUrl}/auth/user`, { headers });

        if (!response.ok) throw new Error("Não foi possível carregar os dados do perfil.");

        const profileData: UserData = await response.json();
        setUserData(profileData);

      } catch (e: any) {
        setError(e.message);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [session]);

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(current => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`${config.apiUrl}/auth/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data['access']}`
        },
        body: JSON.stringify(userData),
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        throw new Error(formatApiError(dataResponse));
      } else {
        data['user'] = dataResponse;
        setSession(JSON.stringify(data));
      }

      Alert.alert("Sucesso!", `Seu perfil foi atualizado.`);
    } catch (e: any) {
      setError(e.message);
      console.error("Erro ao salvar perfil:", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#22c55e" /></View>;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={26} color="#f1f5f9" />
            </TouchableOpacity>
            <Text style={styles.title}>Editar Perfil</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.inputRead}
              value={userData.username}
              readOnly={true}
              placeholder="seu.username"
              placeholderTextColor="#525f76"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.inputRead}
              value={userData.email}
              readOnly={true}
              placeholder="seu@email.com"
              placeholderTextColor="#525f76"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Primeiro Nome</Text>
            <TextInput
              style={styles.input}
              value={userData.first_name}
              onChangeText={(text) => handleInputChange('first_name', text)}
              placeholder="Seu primeiro nome"
              placeholderTextColor="#525f76"
            />

            <Text style={styles.label}>Último Nome</Text>
            <TextInput
              style={styles.input}
              value={userData.last_name}
              onChangeText={(text) => handleInputChange('last_name', text)}
              placeholder="Seu sobrenome"
              placeholderTextColor="#525f76"
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={[styles.saveButton, { opacity: saving ? 0.7 : 1 }]} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}