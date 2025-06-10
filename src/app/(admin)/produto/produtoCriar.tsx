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
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/produtoCriar.style';

interface ParteProduto {
  id: number;
  nome: string;
  imagem: string;
}

export default function ProdutoCriarScreen() {
  const { session } = useSession();
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const partsResponse = await fetch(`${config.apiUrl}/api/partes-produto/`,{
          headers: {
            Authorization: `Bearer ${data['access']}`
          }
        });
        const partsData = await partsResponse.json();
        setAllParts(partsData.results || []);

        if (isEditing) {
          const productResponse = await fetch(`${config.apiUrl}/api/produto/${params.id}/`,{
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


    const apiUrl = isEditing 
      ? `${config.apiUrl}/api/produto/${params.id}/` 
      : `${config.apiUrl}/api/produto/`;
      
    const method = isEditing ? 'PATCH' : 'POST';

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

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#22c55e" /></View>;
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={26} color="#f1f5f9" />
            </TouchableOpacity>
            <Text style={styles.title}>{isEditing ? 'Editar Produto' : 'Adicionar Produto'}</Text>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

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

            <TouchableOpacity style={[styles.saveButton, { opacity: saving ? 0.7 : 1 }]} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Salvar Produto</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}