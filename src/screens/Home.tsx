import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, RefreshControl, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../contexts/AuthContext';
import { OcorrenciaCard } from '../components/OcorrenciaCard';
import { Ocorrencia } from '../types/ocorrencia';
import { TipoDesastre } from '../types/tipoDesastre';
import { obterOcorrencias } from '../services/ocorrenciasService';
import { CORES, ESPACO, RAIOS, ALTURAS } from '../styles/tema';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const FILTROS: Array<{ key: string; label: string; emoji?: string }> = [
  { key: 'todos', label: 'Todos' },
  { key: 'enchente',     label: 'Enchente',     emoji: '🌊' },
  { key: 'deslizamento', label: 'Deslizamento', emoji: '🏔️' },
  { key: 'vendaval',     label: 'Vendaval',     emoji: '🌪️' },
  { key: 'incendio',     label: 'Incêndio',     emoji: '🔥' },
  { key: 'estiagem',     label: 'Estiagem',     emoji: '🏜️' },
  { key: 'outro',        label: 'Outro',        emoji: '⚠️' },
];

export function Home({ navigation }: Props) {
  const { usuario, logout } = useAuth();
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [filtro, setFiltro] = useState<string>('todos');
  const [refreshing, setRefreshing] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const iniciais = usuario
    ? usuario.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '?';

  async function carregarOcorrencias() {
    const lista = await obterOcorrencias();
    setOcorrencias(lista.sort((a, b) => b.data.getTime() - a.data.getTime()));
  }

  useFocusEffect(
    useCallback(() => {
      carregarOcorrencias();
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    await carregarOcorrencias();
    setRefreshing(false);
  }

  const lista = filtro === 'todos'
    ? ocorrencias
    : ocorrencias.filter((o) => o.tipo === filtro);

  return (
    <View style={estilos.tela}>
      {/* Header */}
      <LinearGradient colors={['#0c1733', '#080e1c']} style={estilos.header}>
        <View style={estilos.headerRow}>
          {/* Mini logo */}
          <View style={estilos.miniLogo}>
            <Text style={{ fontSize: 16 }}>🛰️</Text>
          </View>

          {/* Centro */}
          <View style={estilos.headerCentro}>
            <View style={estilos.eyebrowRow}>
              <View style={estilos.dotVivo} />
              <Text style={estilos.eyebrow}>{ocorrencias.length} alertas ativos</Text>
            </View>
            <Text style={estilos.headerTitulo}>Feed de Alertas</Text>
          </View>

          {/* Avatar */}
          <TouchableOpacity
            style={estilos.avatar}
            onPress={() => setMenuAberto(true)}
            activeOpacity={0.7}
          >
            <Text style={estilos.avatarTexto}>{iniciais}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filtros */}
      <View style={estilos.filtrosBorda}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.filtros}
        >
          {FILTROS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[estilos.chip, filtro === f.key && estilos.chipAtivo]}
              onPress={() => setFiltro(f.key)}
              activeOpacity={0.7}
            >
              {f.emoji && <Text style={estilos.chipEmoji}>{f.emoji}</Text>}
              <Text style={[estilos.chipTexto, filtro === f.key && estilos.chipTextoAtivo]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista */}
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.listaContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={CORES.azul} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={estilos.vazio}>
            <Text style={estilos.vazioIcone}>📡</Text>
            <Text style={estilos.vazioTitulo}>Nenhum alerta</Text>
            <Text style={estilos.vazioSub}>Não há registros para este filtro.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <OcorrenciaCard
            ocorrencia={item}
            onPress={() => navigation.navigate('DetalhesOcorrencia', { ocorrenciaId: item.id })}
          />
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={estilos.fabWrap}
        onPress={() => navigation.navigate('NovaOcorrencia')}
        activeOpacity={0.85}
      >
        <LinearGradient colors={['#60A5FA', '#3B82F6']} style={estilos.fab}>
          <Text style={estilos.fabIcone}>+</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Menu dropdown */}
      <Modal visible={menuAberto} transparent animationType="fade" onRequestClose={() => setMenuAberto(false)}>
        <TouchableOpacity style={estilos.overlay} onPress={() => setMenuAberto(false)} activeOpacity={1}>
          <View style={estilos.dropdown}>
            {/* Info usuário */}
            <View style={estilos.dropdownUsuario}>
              <View style={estilos.avatarSm}>
                <Text style={estilos.avatarTexto}>{iniciais}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={estilos.dropdownNome} numberOfLines={1}>{usuario?.nome}</Text>
                <Text style={estilos.dropdownEmail} numberOfLines={1}>{usuario?.email}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={estilos.dropdownBotao}
              onPress={() => { setMenuAberto(false); navigation.navigate('MinhasOcorrencias'); }}
              activeOpacity={0.7}
            >
              <Text style={estilos.dropdownBotaoTexto}>📊 Meus alertas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[estilos.dropdownBotao, estilos.dropdownDanger]}
              onPress={() => { setMenuAberto(false); logout(); }}
              activeOpacity={0.7}
            >
              <Text style={[estilos.dropdownBotaoTexto, { color: CORES.dangerTexto }]}>🚪 Sair da conta</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  header: {
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: ESPACO.md,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  miniLogo: {
    width: 34, height: 34, borderRadius: 9,
    backgroundColor: '#14213f',
    borderWidth: 1, borderColor: 'rgba(96,165,250,0.4)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  headerCentro: { flex: 1, minWidth: 0 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dotVivo: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: CORES.riscoAlto,
  },
  eyebrow: {
    color: CORES.textoMuted,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  headerTitulo: {
    color: CORES.texto,
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    marginTop: 3,
  },
  avatar: {
    width: 38, height: 38, borderRadius: RAIOS.md,
    backgroundColor: '#1e3a6b',
    borderWidth: 1, borderColor: 'rgba(96,165,250,0.4)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarSm: {
    width: 38, height: 38, borderRadius: RAIOS.md,
    backgroundColor: '#1e3a6b',
    borderWidth: 1, borderColor: 'rgba(96,165,250,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTexto: { color: CORES.azulEl, fontSize: 14, fontWeight: '700' },
  filtrosBorda: { borderBottomWidth: 1, borderBottomColor: CORES.borda },
  filtros: { paddingHorizontal: ESPACO.md, paddingVertical: 12, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: ALTURAS.chip,
    paddingHorizontal: 14,
    borderRadius: RAIOS.sm,
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  chipAtivo: {
    backgroundColor: 'rgba(59,130,246,0.16)',
    borderColor: CORES.azul,
  },
  chipEmoji: { fontSize: 12 },
  chipTexto: { color: CORES.textoSec, fontSize: 12.5, fontWeight: '500' },
  chipTextoAtivo: { color: CORES.azulEl },
  listaContent: { padding: ESPACO.md, paddingBottom: 110 },
  vazio: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  vazioIcone: { fontSize: 48, marginBottom: 14, opacity: 0.4 },
  vazioTitulo: { color: CORES.textoSec, fontSize: 14, fontWeight: '600' },
  vazioSub: { color: CORES.textoMuted, fontSize: 12.5, marginTop: 5 },
  fabWrap: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 12,
  },
  fab: {
    width: ALTURAS.fab, height: ALTURAS.fab,
    borderRadius: RAIOS.fab,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(147,197,253,0.6)',
  },
  fabIcone: { color: '#fff', fontSize: 26, lineHeight: 32, fontWeight: '300' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'flex-end', paddingTop: 110, paddingRight: 18 },
  dropdown: {
    width: 220,
    backgroundColor: CORES.glass,
    borderWidth: 1,
    borderColor: CORES.glassBorda,
    borderRadius: 14,
    padding: 12,
  },
  dropdownUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
    marginBottom: 2,
  },
  dropdownNome: { color: CORES.texto, fontSize: 13, fontWeight: '600' },
  dropdownEmail: { color: CORES.textoMuted, fontSize: 10, marginTop: 2 },
  dropdownBotao: {
    height: 40,
    borderRadius: RAIOS.md,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: CORES.borda,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginTop: 8,
  },
  dropdownDanger: {
    backgroundColor: CORES.dangerFundo,
    borderColor: CORES.dangerBorda,
  },
  dropdownBotaoTexto: { color: CORES.texto, fontSize: 11, fontWeight: '600' },
});
