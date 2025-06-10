import { useSession } from "@/src/hooks/auth";
import config from "@/src/utils/config";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


interface ParteProduto {
  id: number;
  nome: string;
  imagem: string;
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { marginRight: 16 },
  title: { color: "#f1f5f9", fontSize: 24, fontWeight: "700" },
  formContainer: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#cbd5e1', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#1e293b', color: '#f1f5f9', borderRadius: 10, padding: 12, fontSize: 15, borderWidth: 1, borderColor: '#334155' },
  inputMultiline: { minHeight: 100, textAlignVertical: 'top' },
  imagePicker: { alignItems: 'center', justifyContent: 'center', height: 180, backgroundColor: '#1e293b', borderWidth: 2, borderColor: '#334155', borderStyle: 'dashed', borderRadius: 8, marginBottom: 16, overflow: 'hidden' },
  imagePickerText: { color: '#94a3b8' },
  imagePreview: { width: '100%', height: '100%' },
  partsContainer: { marginTop: 24 },
  partItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  partCheckbox: { width: 24, height: 24, borderRadius: 4, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  partName: { color: '#f1f5f9', fontSize: 16 },
  saveButton: { backgroundColor: "#22c55e", padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: '#ef4444', textAlign: 'center', marginVertical: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
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

export default function ProdutoCrudScreen() {

  const { signOut, session } = useSession();
  const data = JSON.parse(session || '{}');

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!params.id;


  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [imagemUri, setImagemUri] = useState<string | null>(null);


  const [allParts, setAllParts] = useState<ParteProduto[]>([]);
  const [selectedPartIds, setSelectedPartIds] = useState<Set<number>>(new Set());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  
  const toggleDeleteDialog = () => {
    setDeleteDialogVisible(true);
  };

  useEffect(() => {
    const loadData = async () => {
      try {

        const partsResponse = await fetch(`${config.apiUrl}/api/partes-produto/`, {
          headers: {
            Authorization: `Bearer ${data['access']}`
          }
        });

        const partsData = await partsResponse.json();
        setAllParts(partsData.results || []);

 
        if (isEditing) {
          const productResponse = await fetch(`${config.apiUrl}/api/produto/${params.id}/`, {
            headers: {
              Authorization: `Bearer ${data['access']}`
            }
          });
          const productData = await productResponse.json();
          setNome(productData.nome);
          setDescricao(productData.descricao);
          setPreco(productData.preco);
          setImagemUri(productData.imagem);

          setSelectedPartIds(new Set(productData.partes));
        }
      } catch (e: any) {
        setError("Erro ao carregar dados. " + e.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id, isEditing]);

  const handleTogglePart = (partId: number) => {
    const newSelectedIds = new Set(selectedPartIds);
    if (newSelectedIds.has(partId)) {
      newSelectedIds.delete(partId);
    } else {
      newSelectedIds.add(partId);
    }
    setSelectedPartIds(newSelectedIds);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImagem(result.assets[0]);
      setImagemUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {

    if (!nome.trim() || !preco.trim()) {
      setError("Nome e Preço são obrigatórios.");
      return;
    }
    

    // if (!Array.from(selectedPartIds).length) {
    //   setError("Ao menos um ensumo deve ser selecionado!");
    //   return;
    // }

    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', preco.replace(',', '.'));


    Array.from(selectedPartIds).forEach(partId => {
      formData.append('partes', String(partId));
    });

    if (imagem) {
      if (Platform.OS === 'web') {
        const response = await fetch(imagem.uri);
        const blob = await response.blob();
        formData.append('imagem', blob, `photo.${blob.type.split('/')[1]}`);
      } else {
        const uriParts = imagem.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('imagem', {
          uri: imagem.uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }
    }

    const apiUrl = `${config.apiUrl}/api/produto/${params.id}/`;
    const method = 'PUT'

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Authorization': `Bearer ${data['access']}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      Alert.alert("Sucesso!", `Produto ${isEditing ? 'atualizado' : 'criado'} com sucesso.`);
      router.back();

    } catch (e: any) {
      setError(`Erro ao salvar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async () => {

    setSaving(true);
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/api/produto/${params.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${data['access']}`
        },
      });
      if (!response.ok) { throw new Error('Falha ao deletar o item.'); }
      Alert.alert("Sucesso!", "Item deletado.");
      router.back();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#22c55e" /></View>;
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={26} color="#f1f5f9" />
            </TouchableOpacity>
            <Text style={styles.title}>{isEditing ? 'Editar Produto' : 'Adicionar Produto'}</Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nome do Produto</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} />

            <Text style={styles.label}>Descrição</Text>
            <TextInput style={[styles.input, styles.inputMultiline]} multiline value={descricao} onChangeText={setDescricao} />

            <Text style={styles.label}>Preço Base (R$)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={preco} onChangeText={setPreco} />

            <Text style={styles.label}>Imagem</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
              {imagemUri ? <Image source={{ uri: imagemUri }} style={styles.imagePreview} /> : <Text style={styles.imagePickerText}>Selecionar Imagem</Text>}
            </TouchableOpacity>

            <View style={styles.partsContainer}>
              <Text style={styles.label}>Adicionais</Text>
              {allParts.map(part => (
                <TouchableOpacity key={part.id} style={styles.partItem} onPress={() => handleTogglePart(part.id)}>
                  <View style={[styles.partCheckbox, {
                    backgroundColor: selectedPartIds.has(part.id) ? '#22c55e' : 'transparent',
                    borderColor: selectedPartIds.has(part.id) ? '#22c55e' : '#334155'
                  }]}>
                    {selectedPartIds.has(part.id) && <Ionicons name="checkmark" size={18} color="#fff" />}
                  </View>
                  <Text style={styles.partName}>{part.nome}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity style={[styles.saveButton, { opacity: saving ? 0.7 : 1 }]} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Salvar Produto</Text>}
            </TouchableOpacity>
            {isEditing && (
            <TouchableOpacity style={[styles.deleteButton, { opacity: saving ? 0.6 : 1 }]} onPress={toggleDeleteDialog} disabled={saving}>
              <Text style={styles.deleteButtonText}>Deletar</Text>
            </TouchableOpacity>
          )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal transparent={true} visible={deleteDialogVisible} animationType="fade" onRequestClose={() => setDeleteDialogVisible(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setDeleteDialogVisible(false)}>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => { }}>
            <Text style={styles.modalTitle}>Realmente deseja remover a Insumo/Parte {nome}?</Text>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setDeleteDialogVisible(false)}>
              <Text style={styles.modalCancelButtonText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalConfirmaButton} onPress={handleDelete}>
              <Text style={styles.modalCancelButtonText}>Remover</Text>
            </TouchableOpacity>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}