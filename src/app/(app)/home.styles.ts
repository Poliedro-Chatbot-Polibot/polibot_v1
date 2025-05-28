import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'space-between',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 102,
    opacity: 0.8,
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#334155',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9'
  },

  chatBubble: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginTop: 40,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#475569',
  },
  chatText: {
    fontSize: 17,
    color: '#e2e8f0',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  actions: {
    gap: 18,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  actionBtn: {
    backgroundColor: '#334155',
    paddingVertical: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60a5fa',
  },
});
