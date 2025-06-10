import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles/adminDashboard.style';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const menuItems = [
    {
      title: 'Gerenciar Partes',
      subtitle: 'Adicionar, editar e remover partes dos produtos.',
      icon: 'puzzle-piece',
      path: '/(admin)/produto/parte/parteLista',
    },
    {
      title: 'Gerenciar Produtos',
      subtitle: 'Criar e configurar os produtos principais.',
      icon: 'box-open',
      path: '/(admin)/produto/produtoLista',
    },
    {
      title: 'Ver Pedidos',
      subtitle: 'Acompanhar os pedidos em andamento e finalizados.',
      icon: 'receipt',
      path: '/(admin)/pedidos/pedidosLista',
    },
    {
        title: 'Gerenciar Usuários',
        subtitle: 'Visualizar e gerenciar contas de usuários.',
        icon: 'users',
        path: '/(admin)/users/usersLista',
      },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
            
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
            >
                <Text style={styles.backButtonText}>‹</Text> 
            </TouchableOpacity>
            
            <View style={styles.header}>
                <Text style={styles.title}>Painel Admin</Text>
                <Text style={styles.subtitle}>Gerenciamento completo da aplicação.</Text>
            </View>

            {menuItems.map((item) => (
                <TouchableOpacity 
                    key={item.title} 
                    style={styles.menuItem} 
                    onPress={() => item.path ? router.push(item.path as any) : Alert.alert("Em breve")}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemTextContainer}>
                        <Text style={styles.menuItemTitle}>{item.title}</Text>
                        <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    </View>
                    <Text style={styles.arrowIcon}>›</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
  );
}