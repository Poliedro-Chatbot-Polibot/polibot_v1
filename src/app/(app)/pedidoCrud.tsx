import { useSession } from "@/src/hooks/auth";
import config from "@/src/utils/config";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import styles from "./styles/pedidoCrud.styles";

interface CarrinhoItem {
  idUnico: string;
  produtoBase: any;
  partesSelecionadas: { [parteId: string]: number };
  quantidadeItem: number;
  observacoes?: string;
}

export default function PedidoCrudScreen() {
  const { session } = useSession();
  const data = JSON.parse(session || '{}');

  const [observacao, setObservacao] = useState<string>('');
  const [produtos, setProdutos] = useState<any[]>([]);
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [produtoModal, setProdutoModal] = useState<any | null>(null);
  const [carrinhoVisivel, setCarrinhoVisivel] = useState(false);
  const [configuracaoAtualPartes, setConfiguracaoAtualPartes] = useState<{
    [produtoId: string]: { [parteId: string]: number };
  }>({});

  const router = useRouter();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/api/produto/`, {
          headers: {
            Authorization: `Bearer ${data['access']}`
          }
        });
        setProdutos(res.data.results);
      } catch (err: any) {
        console.log("Erro ao buscar produtos:", err);
        Alert.alert("Erro", "Não foi possível carregar os produtos.");
      }
    };
    fetchProdutos();
  }, []);

  const toggleParteConfig = (produtoId: number, parteId: number) => {
    const prodIdStr = String(produtoId);
    const parteIdStr = String(parteId);
    setConfiguracaoAtualPartes((prev) => {
      const partesAtuais = prev[prodIdStr] || {};
      if (partesAtuais[parteIdStr]) {
        const newPartes = { ...partesAtuais };
        delete newPartes[parteIdStr];
        return { ...prev, [prodIdStr]: newPartes };
      } else {
        return { ...prev, [prodIdStr]: { ...partesAtuais, [parteIdStr]: 1 } };
      }
    });
  };

  const adicionarQuantidadeConfig = (produtoId: number, parteId: number) => {
    const prodIdStr = String(produtoId);
    const parteIdStr = String(parteId);
    setConfiguracaoAtualPartes((prev) => {
      const partesAtuais = prev[prodIdStr] || {};
      return {
        ...prev,
        [prodIdStr]: {
          ...partesAtuais,
          [parteIdStr]: (partesAtuais[parteIdStr] || 0) + 1,
        },
      };
    });
  };

  const diminuirQuantidadeConfig = (produtoId: number, parteId: number) => {
    const prodIdStr = String(produtoId);
    const parteIdStr = String(parteId);
    setConfiguracaoAtualPartes((prev) => {
      const partesAtuais = prev[prodIdStr] || {};
      if (partesAtuais[parteIdStr] > 1) {
        return {
          ...prev,
          [prodIdStr]: {
            ...partesAtuais,
            [parteIdStr]: partesAtuais[parteIdStr] - 1,
          },
        };
      } else {
        const newPartes = { ...partesAtuais };
        delete newPartes[parteIdStr];
        return { ...prev, [prodIdStr]: newPartes };
      }
    });
  };

  const handleAdicionarItemAoCarrinho = () => {
    if (!produtoModal && !configuracaoAtualPartes) return;

    const produtoIdStr = String(produtoModal.id);
    const partesConfiguradasParaEsteProduto = configuracaoAtualPartes[produtoIdStr];

    // if (!partesConfiguradasParaEsteProduto || Object.keys(partesConfiguradasParaEsteProduto).length === 0) {
    //   Alert.alert("Atenção", "Personalize seu produto selecionando os ingredientes.");
    //   return;
    // }

    for (const parte of produtoModal?.partes_produto) {
      if (!partesConfiguradasParaEsteProduto[parte['id']] && Boolean(parte['obrigatorio'])) {
        return Alert.alert("Item Obrigatorio", `${parte.nome} e um adicional obrigatorio!`);
      }
    }

    const novoItem: CarrinhoItem = {
      idUnico: `${produtoModal.id}-${Date.now()}`,
      produtoBase: produtoModal,
      partesSelecionadas: partesConfiguradasParaEsteProduto || {},
      quantidadeItem: 1,
      observacoes: observacao
    };

    setCarrinho((carrinhoAtual) => [...carrinhoAtual, novoItem]);

    setConfiguracaoAtualPartes(prev => {
      const newState = { ...prev };
      delete newState[produtoIdStr];
      return newState;
    });

    setProdutoModal(null);
    setObservacao('');
    Alert.alert("Sucesso", `${produtoModal.nome} adicionado ao carrinho!`);
  };

  const aumentarQuantidadeNoCarrinho = (idUnicoItem: string) => {
    setCarrinho(carrinhoAtual =>
      carrinhoAtual.map(item =>
        item.idUnico === idUnicoItem
          ? { ...item, quantidadeItem: item.quantidadeItem + 1 }
          : item
      )
    );
  };

  const diminuirQuantidadeNoCarrinho = (idUnicoItem: string) => {
    setCarrinho(carrinhoAtual =>
      carrinhoAtual
        .map(item =>
          item.idUnico === idUnicoItem
            ? { ...item, quantidadeItem: Math.max(0, item.quantidadeItem - 1) }
            : item
        )
        .filter(item => item.quantidadeItem > 0)
    );
  };

  const removerItemDoCarrinho = (idUnicoItem: string) => {
    Alert.alert(
      "Remover Item",
      "Tem certeza que deseja remover este item do carrinho?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            setCarrinho(carrinhoAtual =>
              carrinhoAtual.filter(item => item.idUnico !== idUnicoItem)
            );
          },
        },
      ]
    );
  };

  const calcularPrecoUnidadeItemCarrinho = (itemCarrinho: CarrinhoItem) => {
    let precoTotalPartes = 0;
    const produto = itemCarrinho.produtoBase;
    const partesSelecionadas = itemCarrinho.partesSelecionadas;

    if (produto && produto.partes_produto && partesSelecionadas) {
      Object.entries(partesSelecionadas).forEach(([parteId, quantidade]) => {
        const parteDefinicao = produto.partes_produto.find((p: any) => String(p.id) === parteId);
        if (parteDefinicao && parteDefinicao.preco) {
          precoTotalPartes += parseFloat(parteDefinicao.preco) * Number(quantidade);
        }
      });
    }

    const precoBase = produto.preco ? parseFloat(produto.preco) : 0;
    return precoBase + precoTotalPartes;
  };

  const calcularTotalPedido = () => {
    return carrinho.reduce((total, item) => {
      const precoUnidade = calcularPrecoUnidadeItemCarrinho(item);
      return total + (precoUnidade * item.quantidadeItem);
    }, 0);
  };

  const enviarPedido = async () => {
    if (carrinho.length === 0) {
      Alert.alert("Carrinho Vazio", "Adicione itens ao seu pedido.");
      return;
    }

    const pedido_items_api = carrinho.flatMap(itemNoCarrinho => {
      const itemsParaApi: any = [];

      for (let i = 0; i < itemNoCarrinho.quantidadeItem; i++) {
        itemsParaApi.push({
          produto: itemNoCarrinho.produtoBase.id,
          partes_produto: Object.entries(itemNoCarrinho.partesSelecionadas).map(
            ([parteId, quantidade]) => ({
              parte: parseInt(parteId),
              quantidade: quantidade,
            })
          ),
          observacoes: itemNoCarrinho.observacoes || ""
        });
      }
      return itemsParaApi;
    });

    const body = {
      cliente: 1,
      pedido_items: pedido_items_api,
    };

    try {
      await axios.post(`${config.apiUrl}/api/pedido/`, body, {
        headers: {
          Authorization: `Bearer ${data['access']}`
        }
      });

      Alert.alert("Sucesso", "Pedido enviado!");
      setCarrinho([]);
      setCarrinhoVisivel(false);

      router.push('/pedidoLista');
    } catch (error: any) {
      console.log("Erro ao enviar pedido:", error.response?.data || error.message);
      Alert.alert("Erro", `Não foi possível enviar o pedido. ${error.response?.data?.detail || ''}`);
    }
  };

  const getParteById = (produto: any, parteId: number) => {
    return produto?.partes_produto?.find((p: any) => p.id === parteId);
  };

  const totalItensBadge = carrinho.reduce((acc, item) => acc + item.quantidadeItem, 0);

  return (
    <LinearGradient colors={["#0f172a", "#334155"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#f1f5f9" />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.duration(500)} style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            Faca seu pedido
          </Text>
          <Text style={styles.headerSubtitle}>
            Escolha o produto e seus ingredientes
          </Text>
        </Animated.View>

        {produtos.map((produto) => (
          <TouchableOpacity
            key={produto.id}
            onPress={() => {
              if (!configuracaoAtualPartes[String(produto.id)]) {
                setConfiguracaoAtualPartes(prev => ({
                  ...prev,
                  [String(produto.id)]: {}
                }));
              }
              setProdutoModal(produto);
            }}
            activeOpacity={0.9}
            style={styles.produtoCard}
          >
            <Text style={styles.produtoNome}>{produto.nome}</Text>
            <Image
              source={{ uri: produto.imagem }}
              style={styles.produtoImagem}
              resizeMode="cover"
            />
            <Text style={styles.produtoPrecoBase}>
              {produto.descricao}
            </Text>
            <Text style={styles.produtoPrecoBase}>
              A partir de R$ {parseFloat(produto.preco).toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {carrinho.length > 0 && (
        <TouchableOpacity
          onPress={() => setCarrinhoVisivel(true)}
          style={styles.cartButton}
        >
          <Ionicons name="cart" size={28} color="#fff" />
          {totalItensBadge > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItensBadge}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      <Modal
        visible={!!produtoModal}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setProdutoModal(null)
        }}
      >
        <View style={styles.modalViewFull}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitleStrong}>{produtoModal?.nome}</Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {produtoModal?.partes_produto?.map((parte: any) => {
              if (!parte.ativo) return;

              const produtoIdStr = String(produtoModal.id);
              const parteIdStr = String(parte.id);

              const selecionado = configuracaoAtualPartes[produtoIdStr]?.[parteIdStr] !== undefined;
              const quantidade = configuracaoAtualPartes[produtoIdStr]?.[parteIdStr] || 0;

              return (
                <TouchableOpacity
                  key={parte.id}
                  onPress={() => {
                    if (parte.obrigatorio && parte.minimo === 1 && quantidade === 1) {
                      return;
                    }
                    toggleParteConfig(produtoModal.id, parte.id);
                  }}
                  style={[
                    styles.parteOption,
                    selecionado && styles.parteOptionSelected,
                  ]}
                >
                  <Image
                    source={{ uri: parte.imagem }}
                    style={styles.parteImagem}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.parteNome}>{parte.nome}</Text>
                    <Text style={styles.partePreco}>
                      R$ {parseFloat(parte.preco).toFixed(2)}
                    </Text>
                    <View style={styles.parteDetalhesContainer}>
                      {parte.obrigatorio && (
                        <Text style={styles.parteObrigatorioTexto}>Obrigatório</Text>
                      )}
                      {(parte.minimo > 0) && (
                        <Text style={styles.parteDetalheTexto}>
                          Mín: {parte.minimo}
                        </Text>
                      )}
                      {(parte.maximo > 0 && parte.maximo < 999) && (
                        <Text style={styles.parteDetalheTexto}>
                          Máx: {parte.maximo}
                        </Text>
                      )}
                    </View>
                  </View>

                  {(selecionado || (parte.obrigatorio && quantidade < (parte.minimo || 1))) && (
                    <View style={styles.parteQuantidadeControl}>
                      <TouchableOpacity
                        onPress={() => diminuirQuantidadeConfig(produtoModal.id, parte.id)}
                        disabled={parte.obrigatorio && (quantidade <= (parte.minimo || 0)) && (parte.minimo !== 0)}
                      >
                        <Text style={[
                          styles.parteQuantidadeButtonText,
                          (parte.obrigatorio && (quantidade <= (parte.minimo || 0)) && (parte.minimo !== 0)) && { color: '#666' }
                        ]}>
                          -
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.parteQuantidadeText}>{quantidade}</Text>
                      <TouchableOpacity
                        onPress={() => adicionarQuantidadeConfig(produtoModal.id, parte.id)}
                        disabled={parte.maximo > 0 && quantidade >= parte.maximo}
                      >
                        <Text style={[
                          styles.parteQuantidadeButtonText,
                          (parte.maximo > 0 && quantidade >= parte.maximo) && { color: '#666' }
                        ]}>
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <Text style={styles.observationLabel}>Observações do Pedido:</Text>
          <TextInput
            style={styles.observationInput}
            placeholder="Ex: tirar a cebola, ponto da carne mal passado, etc."
            placeholderTextColor="#64748b"
            multiline={true}
            numberOfLines={4}
            value={observacao}
            onChangeText={setObservacao}
          />
          <TouchableOpacity
            onPress={handleAdicionarItemAoCarrinho}
            style={styles.modalButtonPrimary}
          >
            <Text style={styles.modalButtonText}>Adicionar ao Carrinho</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setProdutoModal(null)}
            style={styles.modalButtonSecondary}
          >
            <Text style={styles.modalButtonTextSecondary}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={carrinhoVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setCarrinhoVisivel(false)}
      >
        <View style={styles.modalViewFull}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setCarrinhoVisivel(false)}
            >
              <Ionicons name="close-circle" size={30} color="#f1f5f9" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Seu Carrinho</Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {carrinho.length === 0 ? (
              <Text style={styles.emptyCartText}>Seu carrinho está vazio.</Text>
            ) : (
              carrinho.map((item) => {
                const precoUnidade = calcularPrecoUnidadeItemCarrinho(item);
                const subtotalItem = precoUnidade * item.quantidadeItem;
                return (
                  <View key={item.idUnico} style={styles.carrinhoItemContainer}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.carrinhoItemNome}>
                        {item.produtoBase.nome}
                      </Text>
                      {Object.entries(item.partesSelecionadas).map(([parteId, qtd]) => {
                        const parteInfo = getParteById(item.produtoBase, Number(parteId));
                        return (
                          <Text key={parteId} style={styles.carrinhoItemParte}>
                            {qtd}x {parteInfo?.nome} (+ R$ {parseFloat(parteInfo?.preco || "0").toFixed(2)})
                          </Text>
                        );
                      })}
                      {item.observacoes && item.observacoes.trim() !== "" && (
                        <Text style={styles.carrinhoItemObservacao}>
                          Obs: {item.observacoes}
                        </Text>
                      )}
                      <Text style={styles.carrinhoItemPrecoUnidade}>
                        Unid.: R$ {precoUnidade.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.carrinhoItemControls}>
                      <TouchableOpacity onPress={() => diminuirQuantidadeNoCarrinho(item.idUnico)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.carrinhoItemQuantidade}>{item.quantidadeItem}</Text>
                      <TouchableOpacity onPress={() => aumentarQuantidadeNoCarrinho(item.idUnico)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removerItemDoCarrinho(item.idUnico)} style={styles.removeButton}>
                        <Ionicons name="trash-outline" size={22} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.carrinhoItemSubtotal}>
                      Subtotal: R$ {subtotalItem.toFixed(2)}
                    </Text>
                  </View>
                );
              })
            )}
          </ScrollView>

          {carrinho.length > 0 && (
            <View style={styles.carrinhoFooter}>
              <Text style={styles.carrinhoTotalText}>
                Total do Pedido: R$ {calcularTotalPedido().toFixed(2)}
              </Text>
              <TouchableOpacity
                onPress={enviarPedido}
                style={styles.modalButtonPrimary}
              >
                <Text style={styles.modalButtonText}>Finalizar Pedido</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setCarrinhoVisivel(false)}
            style={[styles.modalButtonSecondary, { marginTop: carrinho.length === 0 ? 20 : 0 }]}
          >
            <Text style={styles.modalButtonTextSecondary}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
  );
}