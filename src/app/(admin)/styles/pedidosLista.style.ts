import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0f172a" 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#1e293b' 
  },
  headerButton: { 
    backgroundColor: "#1e293b", 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  title: { 
    color: "#f1f5f9", 
    fontSize: 20, 
    fontWeight: "700" 
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  loadingText: { 
    color: '#f1f5f9', 
    marginTop: 10 
  },
  errorText: { 
    color: '#ef4444', 
    fontSize: 16, 
    textAlign: 'center' 
  },
  listContent: { 
    padding: 16, 
    paddingBottom: 100 
  },
  emptyListText: { 
    color: '#94a3b8', 
    textAlign: 'center', 
    fontSize: 16 
  },
  card: { 
    backgroundColor: "#1e293b", 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16, 
    overflow: 'hidden' 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  pedidoCodigo: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#f1f5f9' 
  },
  statusBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  statusText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  cardBody: { 
    marginTop: 10 
  },
  detailText: { 
    fontSize: 14, 
    color: '#cbd5e1', 
    marginBottom: 4 
  },
  detailLabel: { 
    fontWeight: '600', 
    color: '#94a3b8' 
  },
  detailsContainer: { 
    borderTopWidth: 1, 
    borderColor: '#334155', 
    marginTop: 16, 
    paddingTop: 16 
  },
  sectionTitle: { 
    color: '#cbd5e1', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 8 
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
  changeStatusButton: { 
    backgroundColor: '#60a5fa', 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 16 
  },
  changeStatusButtonText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  expandIcon: { 
    alignItems: 'center', 
    marginTop: 8, 
    opacity: 0.6 
  },
  modalBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  modalContainer: { 
    backgroundColor: '#1e293b', 
    borderRadius: 16, 
    padding: 20, 
    width: '100%', 
    maxWidth: 400, 
    elevation: 5 
  },
  modalTitle: { 
    color: '#f1f5f9', 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  modalOption: { 
    backgroundColor: '#334155', 
    paddingVertical: 14, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 10 
  },
  modalOptionText: { 
    color: '#f1f5f9', 
    fontSize: 16, 
    fontWeight: '600' 
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
});

export default styles;