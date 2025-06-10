import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { useSession } from '@/src/hooks/auth';
import config from '@/src/utils/config';
import styles from './styles/pedidoLista.style';

interface ParteConfigurada {
  id: number;
  nome: string;
  preco: string;
  quantidade: number;
  parte_produto: ParteProduto;
}

interface ProdutoInfo {
  id: number;
  nome: string;
  preco: string;
  imagem?: string;
}

interface PedidoItemDetalhado {
  id: number;
  codigo: string;
  produto: ProdutoInfo;
  observacao?: string | null;
  configuracao_partes: ParteConfigurada[];
}

interface PedidoCliente {
  username: string;
  pk: number;
}

interface Pedido {
  id: number;
  cliente: PedidoCliente;
  codigo: string;
  status: string;
  status_display: string;
  observacao_geral?: string | null;
  items: PedidoItemDetalhado[];
  data_criacao: string;
}

interface ParteProduto {
  id: number;
  nome: string;
}

export default function PedidoListaScreen() {
  const router = useRouter();
  const { session } = useSession();
  const data = JSON.parse(session || '{}');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [pedidosList, setPedidosList] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCancellingId, setIsCancellingId] = useState<number | null>(null);

  const openStatusModal = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setIsModalVisible(true);
  };

  const fetchPedidos = useCallback(async () => {
    if (!isRefreshing) setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${config.apiUrl}/api/pedido/`, {
        headers: {
          Authorization: `Bearer ${data['access']}`
        }
      });
      setPedidosList(response.data.results || response.data);
    } catch (e: any) {
      console.error("Erro ao buscar pedidos:", e.response?.data || e.message);
      const errorMessage = "Não foi possível carregar os pedidos. Verifique sua conexão e tente novamente.";
      setError(errorMessage);
      if (!isRefreshing) Alert.alert("Erro", errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPedidos();
  };

  const calcularTotalItem = (item: PedidoItemDetalhado): number => {
    let total = parseFloat(item.produto.preco || "0");
    item.configuracao_partes.forEach(parte => {
      total += parseFloat(parte.preco || "0") * parte.quantidade;
    });
    return total;
  };

  const calcularTotalPedido = (pedido: Pedido): number => {
    return pedido.items.reduce((sum, item) => sum + calcularTotalItem(item), 0);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'A':
      case 'F':
      case 'E':
        return { backgroundColor: '#05966930', color: '#34d399' };
      case 'P':
        return { backgroundColor: '#D9770630', color: '#F59E0B' };
      case 'R':
      case 'C':
        return { backgroundColor: '#DC262630', color: '#EF4444' };
      default:
        return { backgroundColor: '#4B556330', color: '#9CA3AF' };
    }
  };

  const handleCancelarPedido = async (pedidoId: number) => {
    setIsCancellingId(pedidoId);
    try {
      await axios.patch(`${config.apiUrl}/api/pedido/${pedidoId}/`, { status: 'C' }, {
        headers: {
          Authorization: `Bearer ${data['access']}`
        }
      });
      Alert.alert("Sucesso", "Seu pedido foi cancelado.");
      fetchPedidos();
      setPedidosList(prevList =>
        prevList.map(p =>
          p.id === pedidoId ? { ...p, status: 'C', status_display: 'Cancelado' } : p
        )
      );
    } catch (e: any) {
      console.error("Erro ao cancelar pedido:", e.response?.data || e.message);
      Alert.alert("Erro", "Não foi possível cancelar o pedido. Tente novamente mais tarde.");
    } finally {
      setIsCancellingId(null);
    }
  };

  const confirmCancelarPedido = (pedidoId: number, pedidoCodigo: string) => {
    Alert.alert(
      "Cancelar Pedido",
      `Tem certeza que deseja cancelar o pedido #${pedidoCodigo}? Esta ação não pode ser desfeita.`,
      [
        { text: "Não, manter pedido", style: "cancel" },
        { text: "Sim, Cancelar", style: "destructive", onPress: () => handleCancelarPedido(pedidoId) }
      ]
    );
  };

  const renderPedidoCard = ({ item }: { item: Pedido }) => {

    const totalPedido = calcularTotalPedido(item);
    const statusStyle = getStatusStyle(item.status);
    return (
      (
        item['cliente']?.pk === data['user']?.pk) ?
      <TouchableOpacity style={styles.pedidoCard} onPress={() => openStatusModal(item)}>
        <View style={styles.cardHeader}>
          <Text style={styles.pedidoCodigo}>Pedido #{item.codigo}</Text>
          <Text style={[styles.pedidoStatus, { backgroundColor: statusStyle.backgroundColor, color: statusStyle.color }]}>
            {item.status_display}
          </Text>
        </View>
        <Text style={styles.pedidoData}>
          {new Date(item.data_criacao).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' })}
          {' às '}
          {new Date(item.data_criacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <View style={styles.itemsResumo}>
          {item.items.slice(0, 2).map(pItem => (
            <Text key={pItem.id} style={styles.itemNome} numberOfLines={1}>- {pItem.produto.nome}</Text>
          ))}
          {item.items.length > 2 && <Text style={styles.itemNome}>... e mais {item.items.length - 2} itens.</Text>}
          {item.items.length === 0 && <Text style={styles.itemNome}>Pedido sem itens (verificar).</Text>}
        </View>
        {item.observacao_geral && (
          <Text style={styles.observacaoGeral}>Obs: {item.observacao_geral}</Text>
        )}
        <Text style={styles.pedidoTotal}>Total: R$ {totalPedido.toFixed(2)}</Text>
        {item.status === 'P' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => confirmCancelarPedido(item.id, item.codigo)}
            disabled={isCancellingId === item.id}
          >
            {isCancellingId === item.id ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
            )}
          </TouchableOpacity>
        )}
      </TouchableOpacity> : <></>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={["#0f172a", "#334155"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#cbd5e1" />
        <Text style={styles.loadingText}>Carregando seus pedidos...</Text>
      </LinearGradient>
    );
  }

  if (error && pedidosList.length === 0) {
    return (
      <LinearGradient colors={["#0f172a", "#334155"]} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButtonHeader} onPress={() => router.canGoBack() ? router.back() : router.push('/')}>
            <Ionicons name="arrow-back" size={24} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus Pedidos</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={80} color="#475569" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#0f172a", "#334155"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={() => router.canGoBack() ? router.back() : router.push('/')}>
          <Ionicons name="arrow-back" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <View style={{ width: 40 }} />
      </View>
      {pedidosList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={100} color="#475569" />
          <Text style={styles.emptyText}>Você ainda não fez nenhum pedido.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(app)/pedidoCrud')}>
            <Text style={styles.primaryButtonText}>Ver Cardápio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={pedidosList}
            renderItem={renderPedidoCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContentContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#cbd5e1"
                colors={["#cbd5e1"]}
              />
            }
          />
          <Modal transparent={true} visible={isModalVisible} animationType="fade" onRequestClose={() => setIsModalVisible(false)}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setIsModalVisible(false)}>
              <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => { }}>
                <Text style={styles.modalTitle}>Pedido #{selectedPedido?.codigo}</Text>
                <Text style={styles.sectionTitle}>Itens do Pedido:</Text>
                {selectedPedido?.items.map(pedidoItem => (
                  <View key={pedidoItem.id} style={styles.itemCard}>
                    <Text style={styles.itemName}>{pedidoItem.produto?.nome || 'Produto Removido'}</Text>
                    {pedidoItem.configuracao_partes.map((parte, index) => (
                      <Text key={`${parte.parte_produto?.id}-${index}`} style={styles.itemParte}>
                        - {parte.quantidade}x {parte?.nome || 'Insumo Removido'} - R$ {parte.preco}
                      </Text>
                    ))}
                    {!!pedidoItem.observacao && <Text style={styles.itemObs}>Obs: {pedidoItem.observacao}</Text>}
                  </View>
                ))}
                {selectedPedido && <Text style={styles.pedidoTotal}>Total: R$ {calcularTotalPedido(selectedPedido).toFixed(2)}</Text>}
                {!!selectedPedido?.observacao_geral && (
                  <>
                    <Text style={styles.sectionTitle}>Observação Geral:</Text>
                    <Text style={styles.obsGeralText}>{selectedPedido.observacao_geral}</Text>
                  </>
                )}
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.modalCancelButtonText}>Fechar</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </>
      )}
    </LinearGradient>
  );
}