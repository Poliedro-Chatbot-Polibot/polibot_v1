import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';

import { useSession } from '@/src/hooks/auth';
import styles from './styles/index.styles';

export default function HomeScreen() {
  const { signOut, session } = useSession();

  let data = { user: { first_name: 'Convidado', is_staff: false, is_superuser: false, last_name: ' ', image: ' ', pk: 0 } };
  try {
    if (session) {
      data = JSON.parse(session);
    }
  } catch (e) {
    console.error("Falha ao parsear a sessão:", e);
  }

  const logout = () => {
    signOut();
    router.replace('/(auth)/sign-in');
  };

  const goToProfile = () => {
    if (data.user?.pk) {
      router.push(`/(user)/${data.user.pk}`);
    } else {
      Alert.alert("Erro", "Não foi possível encontrar o ID do usuário para navegar.");
    }
  };

  const startChat = () => router.push('/pedidoCrud');
  const viewOrders = () => router.push('/pedidoLista');
  const adminZone = () => router.push('/(admin)/admin');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/POLIBOT.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500)} style={styles.profile}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }} onPress={goToProfile}>

            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={24} color="#a5b4fc" />
          </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { fontFamily: 'Poppins_600SemiBold' }]}>
                {data.user?.first_name} {data.user?.last_name}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Ionicons name="log-out-outline" size={26} color="#f1f5f9" />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      <Animated.View entering={ZoomIn.duration(600).delay(300)} style={styles.chatBubble}>
        <Text style={[styles.chatText, { fontFamily: 'Poppins_400Regular' }]}>
          👋 Olá, {data.user?.first_name}!{'\n'}Como posso te ajudar hoje?
        </Text>
      </Animated.View>

      <View style={styles.actions}>
        <Animated.View entering={FadeInDown.delay(600).duration(600)}>
          <TouchableOpacity style={styles.actionBtn} onPress={startChat}>
            <MaterialCommunityIcons name="food-outline" size={26} color="#60a5fa" />
            <Text style={[styles.actionText, { fontFamily: 'Poppins_400Regular' }]}>Fazer Pedido</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(900).duration(600)}>
          <TouchableOpacity style={styles.actionBtn} onPress={viewOrders}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={26} color="#60a5fa" />
            <Text style={[styles.actionText, { fontFamily: 'Poppins_400Regular' }]}>Ver Pedidos</Text>
          </TouchableOpacity>
        </Animated.View>
        {Boolean(data?.user.is_superuser) && (
          <Animated.View entering={FadeInDown.delay(1200).duration(600)}>
            <TouchableOpacity style={styles.actionBtn} onPress={adminZone}>
              <MaterialCommunityIcons name="shield-crown-outline" size={26} color="#facc15" />
              <Text style={[styles.actionText, { fontFamily: 'Poppins_400Regular' }]}>Area do Admin</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}