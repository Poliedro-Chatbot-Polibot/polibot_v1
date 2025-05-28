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
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function Pedido() {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [selecionados, setSelecionados] = useState<{
        [produtoId: number]: { [parteId: number]: number };
    }>({});
    const [produtoModal, setProdutoModal] = useState<any | null>(null);
    const [carrinhoVisivel, setCarrinhoVisivel] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const res = await axios.get(`${config.apiUrl}/api/produto/`);
                setProdutos(res.data.results);
            } catch (err: any) {
                console.log("Erro ao buscar produtos:", err);
                Alert.alert("Erro", "Não foi possível carregar os produtos.");
            }
        };

        fetchProdutos();
    }, []);

    const toggleParte = (produtoId: number, parteId: number) => {
        setSelecionados((prev) => {
            const partes = prev[produtoId] || {};
            if (partes[parteId]) {
                const newPartes = { ...partes };
                delete newPartes[parteId];
                return { ...prev, [produtoId]: newPartes };
            } else {
                return { ...prev, [produtoId]: { ...partes, [parteId]: 1 } };
            }
        });
    };

    const adicionarQuantidade = (produtoId: number, parteId: number) => {
        setSelecionados((prev) => {
            const partes = prev[produtoId] || {};
            return {
                ...prev,
                [produtoId]: {
                    ...partes,
                    [parteId]: (partes[parteId] || 1) + 1,
                },
            };
        });
    };

    const diminuirQuantidade = (produtoId: number, parteId: number) => {
        setSelecionados((prev) => {
            const partes = prev[produtoId] || {};
            if (partes[parteId] > 1) {
                return {
                    ...prev,
                    [produtoId]: {
                        ...partes,
                        [parteId]: partes[parteId] - 1,
                    },
                };
            } else {
                const newPartes = { ...partes };
                delete newPartes[parteId];
                return { ...prev, [produtoId]: newPartes };
            }
        });
    };

    const enviarPedido = async () => {
        try {
            const pedido_items = Object.entries(selecionados).map(
                ([produtoId, partes]) => ({
                    produto: parseInt(produtoId),
                    partes_produto: Object.entries(partes).map(
                        ([parteId, quantidade]) => ({
                            parte: parseInt(parteId),
                            quantidade,
                        })
                    ),
                })
            );

            const body = {
                cliente: 1,
                pedido_items,
            };

            await axios.post(`${config.apiUrl}/api/pedidos/`, body);
            Alert.alert("Sucesso", "Pedido enviado!");
            setSelecionados({});
            setCarrinhoVisivel(false);
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível enviar o pedido.");
        }
    };

    const getNomeProduto = (produtoId: number) => {
        return produtos.find((p) => p.id === produtoId)?.nome || "Produto";
    };

    const getParteById = (produtoId: number, parteId: number) => {
        const produto = produtos.find((p) => p.id === produtoId);
        return produto?.partes_produto?.find((p: any) => p.id === parteId);
    };

    return (
        <LinearGradient colors={["#0f172a", "#334155"]} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
                <TouchableOpacity
                    style={{
                        marginTop: 50,
                        marginLeft: 16,
                        backgroundColor: "#1e293b",
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#f1f5f9" />
                </TouchableOpacity>

                <Animated.View entering={FadeInDown.duration(500)} style={{ marginTop: 20, paddingHorizontal: 16 }}>
                    <Text style={{ color: "#f1f5f9", fontSize: 24, fontWeight: "700" }}>
                        Monte seu pedido
                    </Text>
                    <Text style={{ color: "#cbd5e1", fontSize: 14, marginTop: 4 }}>
                        Escolha o produto e seus ingredientes
                    </Text>
                </Animated.View>

                {produtos.map((produto) => (
                    <TouchableOpacity
                        key={produto.id}
                        onPress={() => setProdutoModal(produto)}
                        activeOpacity={0.9}
                        style={{
                            backgroundColor: "#1e293b",
                            marginHorizontal: 16,
                            borderRadius: 12,
                            padding: 16,
                            marginTop: 20,
                        }}
                    >
                        <Text style={{ color: "#f1f5f9", fontSize: 20, fontWeight: "600" }}>
                            {produto.nome}
                        </Text>
                        <Image
                            source={{ uri: produto.imagem }}
                            style={{
                                width: "100%",
                                height: 180,
                                borderRadius: 12,
                                marginTop: 12,
                            }}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>


            <TouchableOpacity
                onPress={() => setCarrinhoVisivel(true)}
                style={{
                    position: "absolute",
                    bottom: 90,
                    right: 20,
                    backgroundColor: "#22c55e",
                    padding: 16,
                    borderRadius: 32,
                    elevation: 8,
                }}
            >
                <Ionicons name="cart" size={24} color="#fff" />
            </TouchableOpacity>

         
            <Modal
                visible={!!produtoModal}
                animationType="slide"
                transparent
                onRequestClose={() => setProdutoModal(null)}
            >
                <View style={{ flex: 1, backgroundColor: "#0f172a", padding: 16, paddingTop: 60 }}>
                    <Text style={{ color: "#f1f5f9", fontSize: 22, fontWeight: "700", marginBottom: 10 }}>
                        {produtoModal?.nome}
                    </Text>
                    <ScrollView>
                        {produtoModal?.partes_produto?.map((parte: any) => {
                            const selecionado = selecionados[produtoModal.id]?.[parte.id] !== undefined;
                            const quantidade = selecionados[produtoModal.id]?.[parte.id] || 0;

                            return (
                                <TouchableOpacity
                                    key={parte.id}
                                    onPress={() => toggleParte(produtoModal.id, parte.id)}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: selecionado ? "#22c55e" : "#273449",
                                        borderRadius: 10,
                                        padding: 10,
                                        marginBottom: 8,
                                    }}
                                >
                                    <Image
                                        source={{ uri: parte.imagem }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            marginRight: 12,
                                        }}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: "#f1f5f9", fontSize: 16, fontWeight: "600" }}>
                                            {parte.nome}
                                        </Text>
                                        <Text style={{ color: "#a5b4fc", fontSize: 14, marginTop: 2 }}>
                                            R$ {parte.preco}
                                        </Text>
                                    </View>

                                    {selecionado && (
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                backgroundColor: "#334155",
                                                borderRadius: 20,
                                                paddingHorizontal: 10,
                                                paddingVertical: 4,
                                            }}
                                        >
                                            <TouchableOpacity onPress={() => diminuirQuantidade(produtoModal.id, parte.id)}>
                                                <Text style={{ color: "#f1f5f9", fontSize: 18, paddingHorizontal: 6 }}>
                                                    -
                                                </Text>
                                            </TouchableOpacity>
                                            <Text style={{ color: "#f1f5f9", fontWeight: "600", fontSize: 16 }}>
                                                {quantidade}
                                            </Text>
                                            <TouchableOpacity onPress={() => adicionarQuantidade(produtoModal.id, parte.id)}>
                                                <Text style={{ color: "#f1f5f9", fontSize: 18, paddingHorizontal: 6 }}>
                                                    +
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <TouchableOpacity
                        onPress={() => setProdutoModal(null)}
                        style={{
                            marginTop: 16,
                            backgroundColor: "#64748b",
                            padding: 14,
                            borderRadius: 12,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "600" }}>Concluir</Text>
                    </TouchableOpacity>
                </View>
            </Modal>


            <Modal
                visible={carrinhoVisivel}
                animationType="slide"
                transparent
                onRequestClose={() => setCarrinhoVisivel(false)}
            >
                <View style={{ flex: 1, backgroundColor: "#1e293b", padding: 20, paddingTop: 30 }}>

                    <TouchableOpacity
                        style={{
                            marginTop: 3,
                            marginLeft: 6,
                            backgroundColor: "#22c55e",
                            elevation: 8,
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center'

                        }}
                        onPress={() => setCarrinhoVisivel(false)}
                    >
                        <Ionicons name="arrow-back" size={24} color="#f1f5f9" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 20 }}>
                        Carrinho
                    </Text>

                    <ScrollView>
                        {Object.entries(selecionados).map(([produtoId, partes]) => (
                            <View key={produtoId} style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 18, fontWeight: "600", color: "#22c55e" }}>
                                    {getNomeProduto(Number(produtoId))}
                                </Text>
                                {Object.entries(partes).map(([parteId, qtd]) => {
                                    const parte = getParteById(Number(produtoId), Number(parteId));
                                    return (
                                        <View key={parteId} style={{ marginTop: 6, paddingLeft: 10 }}>
                                            <Text style={{ color: "#f1f5f9" }}>
                                                {qtd}x {parte?.nome} - R$ {parte?.preco}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        onPress={enviarPedido}
                        style={{
                            backgroundColor: "#22c55e",
                            padding: 16,
                            borderRadius: 12,
                            marginTop: 20,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Enviar Pedido</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </LinearGradient>
    );
}
