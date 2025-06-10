import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0f172a" 
  },
  scrollContent: { 
    padding: 20 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 12 
  },
  backButton: { 
    marginRight: 16 
  },
  title: { 
    color: "#f1f5f9", 
    fontSize: 24, 
    fontWeight: "700" 
  },
  formContainer: { 
    padding: 20 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#cbd5e1', 
    marginBottom: 8, 
    marginTop: 16 
  },
  input: { 
    backgroundColor: '#1e293b', 
    color: '#f1f5f9', 
    borderRadius: 10, 
    padding: 12, 
    fontSize: 15, 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  inputMultiline: { 
    minHeight: 100, 
    textAlignVertical: 'top' 
  },
  switchContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#1e293b', 
    padding: 12, 
    borderRadius: 10, 
    marginTop: 8 
  },
  imagePicker: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 150, 
    backgroundColor: '#1e293b', 
    borderWidth: 2, 
    borderColor: '#334155', 
    borderStyle: 'dashed', 
    borderRadius: 8, 
    marginBottom: 16, 
    overflow: 'hidden' 
  },
  imagePickerText: { 
    color: '#94a3b8' 
  },
  imagePreview: { 
    width: '100%', 
    height: '100%' 
  },
  saveButton: { 
    backgroundColor: "#22c55e", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 30 
  },
  saveButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  deleteButton: { 
    backgroundColor: '#ef4444', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 16 
  },
  deleteButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  errorText: { 
    color: '#ef4444', 
    textAlign: 'center', 
    marginVertical: 10 
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0f172a' 
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
    borderColor: '#b53733' 
  },
  modalConfirmaButton: { 
    paddingVertical: 14, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10, 
    borderWidth: 1, 
    borderColor: '#33b548' 
  },
  modalCancelButtonText: { 
    color: '#cbd5e1', 
    fontSize: 16, 
    fontWeight: '600' 
  },
});

export default styles;