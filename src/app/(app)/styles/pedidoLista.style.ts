import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backButtonHeader: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pedidoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pedidoCodigo: {
    color: '#e2e8f0',
    fontSize: 17,
    fontWeight: 'bold',
  },
  pedidoStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    overflow: 'hidden',
    textAlign: 'center',
  },
  pedidoData: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 10,
  },
  itemsResumo: {
    marginBottom: 10,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#334155',
  },
  itemNome: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  observacaoGeral: {
    color: '#94a3b8',
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 10,
    marginTop: 4,
  },
  pedidoTotal: {
    color: '#f1f5f9',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    marginTop: 12,
    color: '#cbd5e1',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  errorText: {
    color: '#fecaca',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: -50,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 12,
    alignItems: 'center',
    backgroundColor: '#ef44441A',
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  itemName: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold'
  },
  itemParte: {
    color: '#cbd5e1',
    fontSize: 14,
    marginLeft: 10,
    marginTop: 4
  },
  itemObs: {
    color: '#facc15',
    fontSize: 13,
    fontStyle: 'italic',
    marginLeft: 10,
    marginTop: 6
  },
  obsGeralText: {
    color: '#cbd5e1',
    fontStyle: 'italic',
    fontSize: 14,
    marginBottom: 16
  },
  sectionTitle: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  modalTitle: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  modalContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 5
  },
  modalCancelButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#64748b'
  },
  modalCancelButtonText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '600'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
});

export default styles;