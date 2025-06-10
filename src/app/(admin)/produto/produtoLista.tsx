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
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from "../styles/produtoLista.style";
;

interface Produto {
  id: number;
  nome: string;
  preco: string;
  imagem: string;
}

const API_URL = `${config.apiUrl}/api/produto/`;

export default function ProdutoListaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useSession();

  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
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
    if (!sessionData?.access) return;

    setError(null);
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${sessionData.access}`
        }
      });
      if (!response.ok) {
        throw new Error('Falha ao buscar produtos. :c');
      }
      const data = await response.json();
      setProducts(data.results || []);
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
      fetchProducts();
    }, [fetchProducts])
  );

  const renderProductItem = ({ item }: { item: Produto }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(admin)/produto/${item.id}`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imagem }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.nome}</Text>
        <Text style={styles.price}>R$ {parseFloat(item.preco).toFixed(2)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#64748b" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Carregando Produtos...</Text>
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
        <Text style={styles.title}>Produtos</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyListText}>Nenhum produto encontrado.</Text>
          </View>
        }
        onRefresh={fetchProducts}
        refreshing={loading}
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => router.push('/(admin)/produto/produtoCriar')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}