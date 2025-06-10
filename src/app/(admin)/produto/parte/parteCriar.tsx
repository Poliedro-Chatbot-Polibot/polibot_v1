import { useSession } from '@/src/hooks/auth';
import config from '@/src/utils/config';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles/parteCriar.style';

const API_URL = `${config.apiUrl}/api/partes-produto/`;

export default function PartesCriarScreen() {
  const { session } = useSession();
  const data = JSON.parse(session || '{}');

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [ativo, setAtivo] = useState(true);
  const [obrigatorio, setObrigatorio] = useState(false);
  const [maximo, setMaximo] = useState('1');
  const [minimo, setMinimo] = useState('0');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "É preciso permitir o acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImagem(result.assets[0]);
    }
  };

  const handleSavePart = async () => {
    if (!nome.trim() || !preco.trim()) {
      setError("Nome, Preço são obrigatórios.");
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

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('nome', nome.trim());
    formData.append('descricao', descricao.trim());
    formData.append('preco', preco.replace(',', '.'));
    formData.append('ativo', String(ativo));
    formData.append('obrigatorio', String(obrigatorio));
    formData.append('maximo', maximo);
    formData.append('minimo', minimo);

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

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${data['access']}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      Alert.alert("Sucesso!", "A nova parte foi adicionada.");
      router.back();

    } catch (e: any) {
      setError(`Erro ao salvar: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Adicionar Nova Parte</Text>
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
            {imagem ? <Image source={{ uri: imagem.uri }} style={styles.imagePreview} /> : <Text style={styles.imagePickerText}>Clique para selecionar</Text>}
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={[styles.saveButton, { opacity: loading ? 0.6 : 1 }]} onPress={handleSavePart} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Salvar Parte</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}