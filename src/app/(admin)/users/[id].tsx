import { useSession } from "@/src/hooks/auth";
import config from "@/src/utils/config";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles/userCriar.style';

export default function UserCriarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useSession();
  const { id } = useLocalSearchParams<{ id: string }>();

  const isEditing = !!id;
  const sessionData = JSON.parse(session || '{}');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [isStaff, setIsStaff] = useState(false);


  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) return;

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/auth/users/${id}/`, {
          headers: { Authorization: `Bearer ${sessionData.access}` }
        });
        if (!response.ok) throw new Error('Usuário não encontrado.');

        const data = await response.json();
        setUsername(data.username);
        setEmail(data.email);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setIsStaff(data.is_staff || false);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, isEditing, session]);

  const handleSave = async () => {
    if (!username.trim()) {
      setError("O nome de usuário é obrigatório.");
      return;
    }
    if (!isEditing && !password) {
      setError("A senha é obrigatória ao criar um novo usuário.");
      return;
    }

    setSaving(true);
    setError(null);

    const body: any = {
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      is_staff: isStaff,
    };

    if (password) {
      body.password = password;
    }

    const apiUrl = isEditing ? `${config.apiUrl}/auth/users/${id}/` : `${config.apiUrl}/auth/users/`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.access}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(Object.values(errorData).join('\n'));
      }

      Alert.alert("Sucesso!", `Usuário ${isEditing ? 'atualizado' : 'criado'} com sucesso.`);
      router.back();
    } catch (e: any) {
      setError(`Erro ao salvar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja deletar o usuário "${username}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar", style: "destructive", onPress: async () => {
            setSaving(true);
            try {
              const response = await fetch(`${config.apiUrl}/auth/users/${id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${sessionData.access}` },
              });
              if (!response.ok) throw new Error('Falha ao deletar o usuário.');

              Alert.alert("Sucesso!", "Usuário deletado.");
              router.back();
            } catch (e: any) {
              setError(e.message);
            } finally {
              setSaving(false);
            }
          }
        },
      ]
    );
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#22c55e" /></View>;
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={26} color="#f1f5f9" />
            </TouchableOpacity>
            <Text style={styles.title}>{isEditing ? 'Editar Usuário' : 'Adicionar Usuário'}</Text>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.formContainer}>
            <Text style={styles.label}>Nome de Usuário</Text>
            <TextInput
              style={[styles.input, isEditing && styles.inputDisabled]}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isEditing}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

            <Text style={styles.label}>Primeiro Nome</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

            <Text style={styles.label}>Último Nome</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

            <Text style={styles.label}>{isEditing ? 'Alterar Senha' : 'Senha'}</Text>
            <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} placeholder={isEditing ? 'Deixe em branco para não alterar' : ''} placeholderTextColor="#64748b" />

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Membro da Equipe (Staff)</Text>
              <Switch value={isStaff} onValueChange={setIsStaff} />
            </View>

            <TouchableOpacity style={[styles.saveButton, { opacity: saving ? 0.7 : 1 }]} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>{isEditing ? 'Salvar Alterações' : 'Criar Usuário'}</Text>}
            </TouchableOpacity>

            {isEditing && (
              <TouchableOpacity style={[styles.deleteButton, { opacity: saving ? 0.7 : 1 }]} onPress={handleDelete} disabled={saving}>
                <Text style={styles.deleteButtonText}>Deletar Usuário</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}