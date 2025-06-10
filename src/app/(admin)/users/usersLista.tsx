import { useSession } from "@/src/hooks/auth";
import config from "@/src/utils/config";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles/usersLista.styles';

interface User {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

const API_URL = `${config.apiUrl}/auth/users/`;

export default function UsersListaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    let sessionData: { access?: string } | null = null;
    if (session) {
      try {
        sessionData = JSON.parse(session);
      } catch (e) {
        setError("Sessão inválida.");
        setLoading(false);
        return;
      }
    }
    if (!sessionData?.access) {
        setError("Não autenticado.");
        setLoading(false);
        return;
    };

    setError(null);
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${sessionData.access}`
        }
      });
      if (!response.ok) {
        throw new Error('Falha ao buscar a lista de usuários.');
      }
      const data = await response.json();
      setUsers(data.results || []);
    } catch (e: any) {
      setError(e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUsers();
    }, [fetchUsers])
  );

  const renderUserItem = ({ item }: { item: User }) => {
    const fullName = (item.first_name || item.last_name) 
      ? `${item.first_name} ${item.last_name}`.trim() 
      : item.username;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(admin)/users/${item.pk}`)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
            <Ionicons name="person" size={24} color="#a5b4fc" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.email}>{item.email || 'Sem email'}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#64748b" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Carregando Usuários...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={26} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={styles.title}>Usuários</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.pk.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyListText}>Nenhum usuário encontrado.</Text>
          </View>
        }
        onRefresh={fetchUsers}
        refreshing={loading}
      />
    </View>
  );
}