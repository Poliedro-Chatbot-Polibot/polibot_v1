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
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles/parteCrud.style';

export default function ParteCrudScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { session } = useSession();
  const sessionData = JSON.parse(session || '{}');

  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = !!id;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [novaImagem, setNovaImagem] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [ativo, setAtivo] = useState(true);
  const [obrigatorio, setObrigatorio] = useState(false);
  const [maximo, setMaximo] = useState('1');
  const [minimo, setMinimo] = useState('0');

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const toggleDeleteDialog = () => {
    setDeleteDialogVisible(true);
  };

  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }

    const fetchPartDetails = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/partes-produto/${id}/`, {
          headers: {
            Authorization: `Bearer ${sessionData['access']}`
          }
        });
        if (!response.ok) {
          throw new Error('Não foi possível encontrar este item.');
        }
        const data = await response.json();

        setNome(data.nome);
        setDescricao(data.descricao || '');
        setPreco(String(data.preco));
        setImagemUri(data.imagem);
        setAtivo(data.ativo);
        setObrigatorio(data.obrigatorio);
        setMaximo(String(data.maximo));
        setMinimo(String(data.minimo));

      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartDetails();
  }, [id, isEditing]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setNovaImagem(result.assets[0]);
      setImagemUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!nome.trim() || !preco.trim()) {
      setError("Nome e Preço são obrigatórios.");
      return;
    }
    if (!isEditing && !novaImagem) {
      setError("A imagem é obrigatória para criar um novo item.");
      return;
    }
    if (obrigatorio && Number(minimo) <= 0) {
      setError("Quantidade minima e obrigatoria!.");
      return;
    }
    if (Number(minimo) > Number(maximo)) {
      setError("Quantidade minima nao pode ser maior que a maxima!.");
      return;
    }

    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append('nome', nome.trim());
    formData.append('descricao', descricao.trim());
    formData.append('preco', preco.replace(',', '.'));
    formData.append('ativo', String(ativo));
    formData.append('obrigatorio', String(obrigatorio));
    formData.append('maximo', maximo);
    formData.append('minimo', minimo);

    if (novaImagem) {
      if (Platform.OS === 'web') {
        const response = await fetch(novaImagem.uri);
        const blob = await response.blob();
        formData.append('imagem', blob, `photo.${blob.type.split('/')[1]}`);
      }

      else {
        const uriParts = novaImagem.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('imagem', {
          uri: novaImagem.uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }
    }

    const apiUrl = isEditing ? `${config.apiUrl}/api/partes-produto/${id}/` : `${config.apiUrl}/api/partes-produto/`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Authorization': `Bearer ${sessionData['access']}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.imagem ? errorData.imagem[0] : JSON.stringify(errorData);
        throw new Error(errorMessage);
      }

      Alert.alert("Sucesso!", `Item ${isEditing ? 'atualizado' : 'adicionado'} com sucesso.`);
      router.back();

    } catch (e: any) {
      setError(`Erro ao salvar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setDeleteDialogVisible(false);
    setLoading(true);

    try {
      const response = await fetch(`${config.apiUrl}/api/partes-produto/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionData['access']}`
        },
      });
      if (!response.ok) { throw new Error('Falha ao deletar o item.'); }
      Alert.alert("Sucesso!", "Item deletado.");
      router.back();
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#22c55e" /></View>;
  }

  return (

    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={26} color="#f1f5f9" />
            </TouchableOpacity>
            <Text style={styles.title}>{isEditing ? 'Editar Parte' : 'Adicionar Nova Parte'}</Text>
          </View>

          <Text style={styles.label}>Nome da Parte</Text>
          <TextInput style={styles.input} placeholder="Ex: Queijo Cheddar" value={nome} onChangeText={setNome} />

          <Text style={styles.label}>Descrição</Text>
          <TextInput style={[styles.input, styles.inputMultiline]} multiline value={descricao} onChangeText={setDescricao} />

          <Text style={styles.label}>Preço Adicional</Text>
          <TextInput style={styles.input} keyboardType="numeric" placeholder="Ex: 2.50" value={preco} onChangeText={setPreco} />

          <View style={styles.switchContainer}>
            <Text style={[styles.label, { marginTop: 0, marginBottom: 0 }]}>Ativo</Text>
            <Switch trackColor={{ false: "#767577", true: "#166534" }} thumbColor={ativo ? "#22c55e" : "#f4f3f4"} value={ativo} onValueChange={setAtivo} />
          </View>

          <View style={styles.switchContainer}>
            <Text style={[styles.label, { marginTop: 0, marginBottom: 0 }]}>Obrigatório</Text>
            <Switch trackColor={{ false: "#767577", true: "#166534" }} thumbColor={obrigatorio ? "#22c55e" : "#f4f3f4"} value={obrigatorio} onValueChange={setObrigatorio} />
          </View>

          <Text style={styles.label}>Quantidade Mínima</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={minimo} onChangeText={setMinimo} />

          <Text style={styles.label}>Quantidade Máxima</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={maximo} onChangeText={setMaximo} />

          <Text style={styles.label}>Imagem</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
            {imagemUri ? <Image source={{ uri: imagemUri }} style={styles.imagePreview} /> : <Text style={styles.imagePickerText}>Clique para selecionar</Text>}
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={[styles.saveButton, { opacity: saving ? 0.6 : 1 }]} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>{isEditing ? 'Salvar Alterações' : 'Adicionar Parte'}</Text>}
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={[styles.deleteButton, { opacity: saving ? 0.6 : 1 }]} onPress={toggleDeleteDialog} disabled={saving}>
              <Text style={styles.deleteButtonText}>Deletar</Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
      <Modal transparent={true} visible={deleteDialogVisible} animationType="fade" onRequestClose={() => setDeleteDialogVisible(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setDeleteDialogVisible(false)}>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => { }}>
            <Text style={styles.modalTitle}>Realmente deseja remover a Insumo/Parte {nome}?</Text>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setDeleteDialogVisible(false)}>
              <Text style={styles.modalCancelButtonText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalConfirmaButton} onPress={handleRemove}>
              <Text style={styles.modalCancelButtonText}>Remover</Text>
            </TouchableOpacity>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}