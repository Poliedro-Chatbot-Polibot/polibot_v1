import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import React from 'react';
import styles from './home.styles'; 

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Polibot</Text>
        <Text style={styles.subtitle}>Your Political Assistant</Text>
      </View>
    </View>
  );
};


export default Home;