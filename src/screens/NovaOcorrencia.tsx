import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../contexts/AuthContext';
import { BotaoPrimario } from '../components/BotaoPrimario';
import { adicionarOcorrencia } from '../services/ocorrenciasService';
import { TipoDesastre } from '../types/tipoDesastre';
import { NivelRisco } from '../types/nivelRisco';
import { CORES, ESPACO, RAIOS, ALTURAS } from '../styles/tema';

type Props = NativeStackScreenProps<RootStackParamList, 'NovaOcorrencia'>;

const MAX_DESC = 280;

const TIPOS: Array<{ key: TipoDesastre; label: string; emoji: string }> = [
  { key: 'enchente',     label: 'Enchente',     emoji: '🌊' },
  { key: 'deslizamento', label: 'Deslizamento', emoji: '🏔️' },
  { key: 'vendaval',     label: 'Vendaval',     emoji: '🌪️' },
  { key: 'incendio',     label: 'Incêndio',     emoji: '🔥' },
  { key: 'estiagem',     label: 'Estiagem',     emoji: '🏜️' },
  { key: 'outro',        label: 'Outro',        emoji: '⚠️' },
];

const RISCOS: Array<{ key: NivelRisco; label: string }> = [
  { key: 'baixo', label: 'BAIXO' },
  { key: 'medio', label: 'MÉDIO' },
  { key: 'alto',  label: 'ALTO'  },
];

const COR_RISCO_ATIVO: Record<NivelRisco, { texto: string; borda: string; fundo: string }> = {
  baixo: { texto: '#6ee7c0', borda: '#10B981', fundo: 'rgba(16,185,129,0.14)' },
  medio: { texto: '#fcd081', borda: '#F59E0B', fundo: 'rgba(245,158,11,0.14)' },
  alto:  { texto: '#fca5a5', borda: '#EF4444', fundo: 'rgba(239,68,68,0.14)' },
};

export function NovaOcorrencia({ navigation }: Props) {
  const { usuario } = useAuth();
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [tipo, setTipo] = useState<TipoDesastre | null>(null);
  const [risco, setRisco] = useState<NivelRisco | null>(null);
  const [descricao, setDescricao] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [bairroFocus, setBairroFocus] = useState(false);
  const [ruaFocus, setRuaFocus] = useState(false);
  const [descFocus, setDescFocus] = useState(false);

  const valido = bairro.trim().length > 0 && rua.trim().length > 0 && tipo !== null && risco !== null;

  async function registrar() {
    if (!valido || !usuario) return;
    setCarregando(true);
    try {
      await adicionarOcorrencia({
        usuarioId: usuario.id,
        autorNome: usuario.nome,
        tipo: tipo!,
        bairro: bairro.trim(),
        rua: rua.trim(),
        descricao: descricao.trim() || 'Sem descrição adicional informada.',
        nivelRisco: risco!,
      });
      Alert.alert('Alerta registrado!', 'Seu alerta foi publicado no feed da comunidade.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível registrar o alerta. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={estilos.tela}>
      {/* Header */}
      <LinearGradient colors={['#0c1733', '#080e1c']} style={estilos.header}>
        <TouchableOpacity style={estilos.btnFechar} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={estilos.btnFecharTexto}>✕</Text>
        </TouchableOpacity>
        <Text style={estilos.headerTitulo}>Registrar Alerta</Text>
        <View style={{ width: 38 }} />
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={estilos.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Localização */}
          <SectionLabel label="Localização" />
          <View style={{ gap: 12, marginBottom: 24 }}>
            <View style={[estilos.inputWrap, bairroFocus && estilos.inputFoco]}>
              <Text style={estilos.inputIcon}>📍</Text>
              <TextInput
                style={estilos.input}
                value={bairro}
                onChangeText={setBairro}
                placeholder="Bairro"
                placeholderTextColor={CORES.textoMuted}
                onFocus={() => setBairroFocus(true)}
                onBlur={() => setBairroFocus(false)}
              />
            </View>
            <View style={[estilos.inputWrap, ruaFocus && estilos.inputFoco]}>
              <Text style={estilos.inputIcon}>📍</Text>
              <TextInput
                style={estilos.input}
                value={rua}
                onChangeText={setRua}
                placeholder="Rua e número"
                placeholderTextColor={CORES.textoMuted}
                onFocus={() => setRuaFocus(true)}
                onBlur={() => setRuaFocus(false)}
              />
            </View>
          </View>

          {/* Tipo */}
          <SectionLabel label="Tipo de Desastre" />
          <View style={estilos.tipoGrid}>
            {TIPOS.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[estilos.tipoCard, tipo === t.key && estilos.tipoCardAtivo]}
                onPress={() => setTipo(t.key)}
                activeOpacity={0.7}
              >
                <Text style={estilos.tipoEmoji}>{t.emoji}</Text>
                <Text style={[estilos.tipoLabel, tipo === t.key && { color: CORES.texto }]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Risco */}
          <SectionLabel label="Nível de Risco" style={{ marginTop: 24 }} />
          <View style={estilos.riscoSeg}>
            {RISCOS.map((r) => {
              const ativo = risco === r.key;
              const cfg = ativo ? COR_RISCO_ATIVO[r.key] : null;
              return (
                <TouchableOpacity
                  key={r.key}
                  style={[
                    estilos.riscoBtn,
                    ativo && { borderColor: cfg!.borda, backgroundColor: cfg!.fundo },
                  ]}
                  onPress={() => setRisco(r.key)}
                  activeOpacity={0.7}
                >
                  <View style={[estilos.riscoDot, ativo && { backgroundColor: cfg!.texto }]} />
                  <Text style={[estilos.riscoBtnTexto, ativo && { color: cfg!.texto }]}>
                    {r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Descrição */}
          <SectionLabel label="Descrição" style={{ marginTop: 24 }} />
          <View style={estilos.descWrap}>
            <TextInput
              style={[estilos.textarea, descFocus && estilos.inputFoco]}
              value={descricao}
              onChangeText={(v) => setDescricao(v.slice(0, MAX_DESC))}
              placeholder="Descreva o risco observado (ex: nível da água, rachaduras, fumaça)..."
              placeholderTextColor={CORES.textoMuted}
              multiline
              textAlignVertical="top"
              onFocus={() => setDescFocus(true)}
              onBlur={() => setDescFocus(false)}
            />
            <Text style={[estilos.contador, descricao.length > MAX_DESC - 30 && { color: CORES.riscoMedio }]}>
              {descricao.length}/{MAX_DESC}
            </Text>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Dock */}
      <View style={estilos.dock}>
        <BotaoPrimario
          label={valido ? 'REGISTRAR ALERTA' : 'Preencha os campos obrigatórios'}
          onPress={registrar}
          disabled={!valido}
          loading={carregando}
        />
      </View>
    </View>
  );
}

function SectionLabel({ label, style }: { label: string; style?: object }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }, style]}>
      <View style={estilos.labelDot} />
      <Text style={estilos.labelTexto}>{label}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: ESPACO.md,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  btnFechar: {
    width: 38, height: 38, borderRadius: RAIOS.md,
    backgroundColor: CORES.fundoCard,
    borderWidth: 1, borderColor: CORES.borda,
    alignItems: 'center', justifyContent: 'center',
  },
  btnFecharTexto: { color: CORES.textoSec, fontSize: 16 },
  headerTitulo: {
    color: CORES.texto, fontSize: 17, fontWeight: '700',
    letterSpacing: 2.4, textTransform: 'uppercase',
  },
  scroll: { padding: ESPACO.md },
  labelDot: {
    width: 5, height: 5, borderRadius: 1,
    backgroundColor: CORES.azul,
    shadowColor: CORES.azul,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  labelTexto: {
    color: CORES.textoSec, fontSize: 11, fontWeight: '600',
    letterSpacing: 1.76, textTransform: 'uppercase',
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: CORES.fundoInput,
    borderWidth: 1, borderColor: CORES.borda,
    borderRadius: RAIOS.md,
    paddingHorizontal: 12,
    height: ALTURAS.input, gap: 10,
  },
  inputFoco: {
    borderColor: CORES.azul,
    shadowColor: CORES.azulEl,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
  },
  inputIcon: { fontSize: 16 },
  input: { flex: 1, color: CORES.texto, fontSize: 14 },
  tipoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tipoCard: {
    width: '47%',
    height: ALTURAS.typeCard,
    borderRadius: 11,
    backgroundColor: CORES.fundoCard,
    borderWidth: 1, borderColor: CORES.borda,
    alignItems: 'center', justifyContent: 'center',
    gap: 7,
  },
  tipoCardAtivo: {
    borderColor: CORES.azulEl,
    backgroundColor: 'rgba(59,130,246,0.12)',
  },
  tipoEmoji: { fontSize: 24 },
  tipoLabel: {
    color: CORES.textoSec, fontSize: 11.5, fontWeight: '600', letterSpacing: 0.46,
  },
  riscoSeg: { flexDirection: 'row', gap: 8 },
  riscoBtn: {
    flex: 1, height: ALTURAS.segBtn,
    borderRadius: RAIOS.md,
    backgroundColor: CORES.fundoCard,
    borderWidth: 1, borderColor: CORES.borda,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 7,
  },
  riscoDot: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: CORES.textoMuted,
  },
  riscoBtnTexto: {
    color: CORES.textoMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1,
  },
  descWrap: { position: 'relative' },
  textarea: {
    backgroundColor: CORES.fundoInput,
    borderWidth: 1, borderColor: CORES.borda,
    borderRadius: RAIOS.md,
    padding: 12,
    color: CORES.texto,
    fontSize: 14,
    lineHeight: 21,
    minHeight: 110,
  },
  contador: {
    position: 'absolute', right: 12, bottom: 10,
    color: CORES.textoMuted, fontSize: 10.5, letterSpacing: 0.63,
  },
  dock: {
    paddingTop: 14, paddingHorizontal: ESPACO.md, paddingBottom: 30,
    borderTopWidth: 1, borderTopColor: CORES.borda,
    backgroundColor: CORES.fundo,
  },
});
