import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: Platform.OS === 'web' ? '15%' : 20,
    justifyContent:'space-between',
    padding: 6
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: Platform.OS === 'web' ? 1200 : '100%',
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 48 : 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 24 : 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default styles;