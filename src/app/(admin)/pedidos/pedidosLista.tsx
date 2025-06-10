import { useSession } from "@/src/hooks/auth";
import config from "@/src/utils/config";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from "../styles/pedidosLista.style";


interface Cliente { id: number; username: string; first_name?: string; }
interface Produto { id: number; nome: string; }
interface ParteProduto { id: number; nome: string; }
interface PedidoItemParte { quantidade: number; parte_produto: ParteProduto | null; nome: string }
interface PedidoItem { id: number; produto: Produto | null; observacao: string | null; configuracao_partes: PedidoItemParte[]; }
type PedidoStatus = 'P' | 'A' | 'R' | 'C' | 'E' | 'F';
interface PedidoDetalhado {
  id: number;
  codigo: string;
  status: PedidoStatus;
  cliente: Cliente | null;
  observacao_geral: string | null;
  items: PedidoItem[];
  data_criacao: string;
}

const STATUS_MAP: Record<PedidoStatus, { text: string; color: string; }> = {
  P: { text: 'Pendente', color: '#facc15' },
  A: { text: 'Produção', color: '#60a5fa' },
  E: { text: 'Enviado', color: '#34d399' },
  F: { text: 'Finalizado', color: '#22c55e' },
  R: { text: 'Rejeitado', color: '#f87171' },
  C: { text: 'Cancelado', color: '#94a3b8' },
};

const API_URL = `${config.apiUrl}/api/pedido/`;

export default function PedidosListAdminScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session, signOut } = useSession();

  const [pedidos, setPedidos] = useState<PedidoDetalhado[]>([]);
  const [expandedPedidoId, setExpandedPedidoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<PedidoDetalhado | null>(null);

  const fetchPedidos = useCallback(async () => {
    let sessionData: { access?: string } | null = null;
    if (session) {
      try {
        sessionData = JSON.parse(session);
      } catch (e) {
        setError("Sessão inválida. Faça login novamente.");
        setLoading(false);
        return;
      }
    }

    if (!sessionData?.access) {
      if (session !== null) setError("Não autenticado.");
      setLoading(false);
      return;
    }

    setError(null);
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${sessionData.access}` },
      });
      if (!response.ok) {
        throw new Error(`Falha ao buscar pedidos (${response.status})`);
      }
      const data = await response.json();
      setPedidos(data.results || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useFocusEffect(useCallback(() => { setLoading(true); fetchPedidos(); }, [fetchPedidos]));

  const handleUpdateStatus = async (pedidoId: number, newStatus: PedidoStatus) => {
    let sessionData: { access?: string } | null = null;
    if (session) sessionData = JSON.parse(session);
    if (!sessionData?.access) {
      Alert.alert("Erro", "Sessão expirada. Faça o login novamente.");
      return;
    }

    setIsModalVisible(false);
    setUpdatingStatusId(pedidoId);

    try {
      const response = await fetch(`${API_URL}${pedidoId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.access}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Não foi possível atualizar o status.");
      }

      setPedidos(prev => prev.map(p => p.id === pedidoId ? { ...p, status: newStatus } : p));
      Alert.alert("Sucesso", "Status do pedido atualizado!");

    } catch (e: any) {
      Alert.alert("Erro", `Ocorreu um erro: ${e.message}`);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const openStatusModal = (pedido: PedidoDetalhado) => {
    setSelectedPedido(pedido);
    setIsModalVisible(true);
  };

  const handleToggleExpand = (pedidoId: number) => {
    setExpandedPedidoId(prevId => (prevId === pedidoId ? null : pedidoId));
  };

  const handleLogout = () => {
    Alert.alert("Confirmar Saída", "Deseja realmente sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => signOut() }
    ]);
  };

  const renderPedidoItem = ({ item }: { item: PedidoDetalhado }) => {
    const isExpanded = expandedPedidoId === item.id;
    const statusInfo = STATUS_MAP[item.status] || { text: 'Desconhecido', color: '#64748b' };
    const dataFormatada = new Date(item.data_criacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleToggleExpand(item.id)} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <Text style={styles.pedidoCodigo}>Pedido #{item.codigo}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}><Text style={styles.statusText}>{statusInfo.text}</Text></View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Cliente:</Text> {item.cliente?.first_name || item.cliente?.username || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Data:</Text> {dataFormatada}</Text>
        </View>

        {isExpanded && (
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Itens do Pedido:</Text>
            {item.items.map(pedidoItem => (
              <View key={pedidoItem.id} style={styles.itemCard}>
                <Text style={styles.itemName}>{pedidoItem.produto?.nome || 'Produto Removido'}</Text>
                {pedidoItem.configuracao_partes.map((parte, index) => (
                  <Text key={`${parte.parte_produto?.id}-${index}`} style={styles.itemParte}>
                    - {parte.quantidade}x {parte?.nome || 'Insumo Removido'}
                  </Text>
                ))}
                {!!pedidoItem.observacao && <Text style={styles.itemObs}>Obs: {pedidoItem.observacao}</Text>}
              </View>
            ))}
            {!!item.observacao_geral && (<><Text style={styles.sectionTitle}>Observação Geral:</Text><Text style={styles.obsGeralText}>{item.observacao_geral}</Text></>)}
            <TouchableOpacity style={styles.changeStatusButton} onPress={() => openStatusModal(item)} disabled={updatingStatusId === item.id}>
              {updatingStatusId === item.id ? <ActivityIndicator color="#fff" /> :
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Ionicons name="alert-sharp" size={20} color="#fff" /><Text style={styles.changeStatusButtonText}>Mudar Status</Text>
                </View>
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.changeStatusButton} disabled={updatingStatusId === item.id}>
              {updatingStatusId === item.id ? <ActivityIndicator color="#fff" /> :
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Ionicons name="print-outline" size={20} color="#fff" /><Text style={styles.changeStatusButtonText}>Imprimir Pedido</Text>
                </View>
              }
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.expandIcon}><Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="#94a3b8" /></View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Carregando Pedidos...</Text>
      </View>
    );
  }

  if (error) {
    return <View style={[styles.container, styles.centered]}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}><Ionicons name="chevron-back" size={26} color="#f1f5f9" /></TouchableOpacity>
        <Text style={styles.title}>Gerenciar Pedidos</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.headerButton}><Ionicons name="log-out-outline" size={26} color="#ef4444" /></TouchableOpacity>
      </View>
      <FlatList
        data={pedidos}
        renderItem={renderPedidoItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        extraData={expandedPedidoId}
        ListEmptyComponent={<View style={styles.centered}><Text style={styles.emptyListText}>Nenhum pedido encontrado.</Text></View>}
        onRefresh={fetchPedidos}
        refreshing={loading}
      />
      <Modal transparent={true} visible={isModalVisible} animationType="fade" onRequestClose={() => setIsModalVisible(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setIsModalVisible(false)}>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => { }}>
            <Text style={styles.modalTitle}>Mudar status do Pedido #{selectedPedido?.codigo}</Text>
            {Object.entries(STATUS_MAP).map(([key, { text }]) => (
              <TouchableOpacity key={key} style={styles.modalOption} onPress={() => { if (selectedPedido) { handleUpdateStatus(selectedPedido.id, key as PedidoStatus); } }}>
                <Text style={styles.modalOptionText}>{text}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}