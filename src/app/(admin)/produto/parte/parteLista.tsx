import { useSession } from "@/src/hooks/auth";
import config from "@/src/utils/config";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles/parteLista.style';

interface ParteProduto {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  preco: string;
  ativo: boolean;
}

const API_URL = `${config.apiUrl}/api/partes-produto/`;

export default function PartesListaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useSession();
  const sessionData = JSON.parse(session || '{}');

  const [parts, setParts] = useState<ParteProduto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${sessionData['access']}`
        }
      });
      if (!response.ok) {
        throw new Error('Falha ao buscar dados da API. Verifique se está logado.');
      }
      const data = await response.json();
      setParts(data.results || []);
    } catch (e: any) {
      setError(e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchParts();
    }, [fetchParts])
  );

  const renderPartItem = ({ item }: { item: ParteProduto }) => {
    const statusColor = item.ativo ? '#22c55e' : '#ef4444';
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(admin)/produto/parte/${item.id}`)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.imagem }}
          style={[styles.image, { borderColor: statusColor }]}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.nome}</Text>
          <Text style={styles.price}>R$ {parseFloat(item.preco).toFixed(2)}</Text>
          <Text style={[styles.status, { color: statusColor }]}>
            {item.ativo ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={{ color: '#f1f5f9', marginTop: 10 }}>Carregando Partes...</Text>
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
        <Text style={styles.title}>Partes do Produto</Text>
      </View>

      <FlatList
        data={parts}
        renderItem={renderPartItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyListText}>Nenhuma parte encontrada.</Text>
          </View>
        }
        onRefresh={fetchParts}
        refreshing={loading}
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => router.push('/(admin)/produto/parte/parteCriar')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}