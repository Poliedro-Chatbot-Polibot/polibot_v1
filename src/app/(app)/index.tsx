import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';

import { useSession } from '@/src/hooks/auth';
import styles from './home.styles';

export default function Home() {
  const { signOut, session } = useSession();
  const data = JSON.parse(session || '{}');

  const logout = () => {
    signOut();
    router.navigate('/(auth)/sign-in');
  };

  const startChat = () => router.navigate('/pedido');
  const viewOrders = () => router.navigate('/');

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
          <Image
            source={{ uri: data.user?.image || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.name,{ fontFamily: 'Poppins_600SemiBold' }]}>
              {data.user?.first_name} {data.user?.last_name}
            </Text>
          </View>
          <TouchableOpacity onPress={logout}>
            <Ionicons name="log-out-outline" size={26} color="#f1f5f9" />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      <Animated.View entering={ZoomIn.duration(600).delay(300)} style={styles.chatBubble}>
        <Text style={[styles.chatText,{ fontFamily: 'Poppins_400Regular' }]}>
          👋 Olá, {data.user?.first_name}!{'\n'}Como posso te ajudar hoje?
        </Text>
      </Animated.View>

      <View style={styles.actions}>
        <Animated.View entering={FadeInDown.delay(600).duration(600)}>
          <TouchableOpacity style={styles.actionBtn} onPress={startChat}>
            <MaterialCommunityIcons name="food-outline" size={26} color="#60a5fa" />
            <Text style={[styles.actionText,{ fontFamily: 'Poppins_400Regular' }]}>Fazer Pedido</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(900).duration(600)}>
          <TouchableOpacity style={styles.actionBtn} onPress={viewOrders}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={26} color="#60a5fa" />
            <Text style={[styles.actionText,{ fontFamily: 'Poppins_400Regular' }]}>Ver Pedidos</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
