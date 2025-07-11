import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  backButton: {
    marginTop: 50,
    marginLeft: 16,
    backgroundColor: "#1e293b",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#f1f5f9",
    fontSize: 28,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#cbd5e1",
    fontSize: 16,
    marginTop: 4,
  },
  produtoCard: {
    backgroundColor: "#1e293b",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  produtoNome: {
    color: "#f1f5f9",
    fontSize: 20,
    fontWeight: "600",
  },
  produtoImagem: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginTop: 12,
  },
  produtoPrecoBase: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "400",
    marginTop: 10,
  },
  cartButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#22c55e",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cartBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#22c55e'
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalViewFull: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  modalCloseButton: {
    position: 'absolute',
    left: 0,
    top: -5,
  },
  modalTitle: {
    color: "#f1f5f9",
    fontSize: 22,
    fontWeight: "700",
    textAlign: 'center',
  },
  modalTitleStrong: {
    color: "#f1f5f9",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: 'center',
  },
  parteOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  parteOptionSelected: {
    borderColor: "#22c55e",
    backgroundColor: "#2a3a52",
  },
  parteImagem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  parteNome: {
    color: "#f1f5f9",
    fontSize: 17,
    fontWeight: "600",
  },
  partePreco: {
    color: "#60a5fa",
    fontSize: 14,
    marginTop: 2,
  },
  parteQuantidadeControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#334155",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  parteQuantidadeButtonText: {
    color: "#f1f5f9",
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  parteQuantidadeText: {
    color: "#f1f5f9",
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 8,
  },
  modalButtonPrimary: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalButtonSecondary: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#64748b'
  },
  modalButtonTextSecondary: {
    color: "#cbd5e1",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyCartText: {
    color: "#94a3b8",
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
  },
  carrinhoItemContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  carrinhoItemNome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22c55e",
    marginBottom: 5,
  },
  carrinhoItemParte: {
    color: "#cbd5e1",
    fontSize: 14,
    marginLeft: 10,
  },
  carrinhoItemPrecoUnidade: {
    color: "#94a3b8",
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 5,
  },
  carrinhoItemControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  quantityButton: {
    backgroundColor: "#334155",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: "#f1f5f9",
    fontSize: 18,
    fontWeight: 'bold',
  },
  carrinhoItemQuantidade: {
    color: "#f1f5f9",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 15,
  },
  removeButton: {
    marginLeft: 'auto',
    padding: 5,
  },
  carrinhoItemSubtotal: {
    color: "#f1f5f9",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 8,
  },
  carrinhoFooter: {
    borderTopWidth: 1,
    borderColor: '#334155',
    paddingTop: 15,
    marginTop: 10,
    marginBottom: 10
  },
  carrinhoTotalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "right",
    marginBottom: 15,
  },
  observationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
    marginTop: 15,
  },
  observationInput: {
    backgroundColor: '#1e293b',
    color: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    textAlignVertical: 'top',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  carrinhoItemObservacao: {
    color: '#adb5bd',
    fontSize: 13,
    fontStyle: 'normal',
    marginTop: 4,
    marginLeft: 10,
  },
  parteDetalhesContainer: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  parteDetalheTexto: {
    fontSize: 12,
    color: '#94a3b8',
    marginRight: 8,
  },
  parteObrigatorioTexto: {
    fontSize: 12,
    color: '#facc15',
    fontWeight: 'bold',
    marginRight: 8,
  }
});

export default styles;