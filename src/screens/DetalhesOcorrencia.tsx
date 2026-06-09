import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../contexts/AuthContext';
import { BadgeRisco } from '../components/BadgeRisco';
import { BotaoPrimario } from '../components/BotaoPrimario';
import { Ocorrencia } from '../types/ocorrencia';
import { TipoDesastre } from '../types/tipoDesastre';
import { NivelRisco } from '../types/nivelRisco';
import { obterOcorrenciaPorId, removerOcorrencia } from '../services/ocorrenciasService';
import { formatarData, formatarHora } from '../utils/formatters';
import { CORES, ESPACO, RAIOS } from '../styles/tema';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhesOcorrencia'>;

const EMOJI_TIPO: Record<TipoDesastre, string> = {
  enchente: '🌊', deslizamento: '🏔️', vendaval: '🌪️',
  incendio: '🔥', estiagem: '🏜️', outro: '⚠️',
};

const LABEL_TIPO: Record<TipoDesastre, string> = {
  enchente: 'Enchente', deslizamento: 'Deslizamento', vendaval: 'Vendaval',
  incendio: 'Incêndio', estiagem: 'Estiagem', outro: 'Outro',
};

const COR_RISCO: Record<NivelRisco, string> = {
  baixo: CORES.riscoBaixo, medio: CORES.riscoMedio, alto: CORES.riscoAlto,
};

export function DetalhesOcorrencia({ navigation, route }: Props) {
  const { usuario } = useAuth();
  const { ocorrenciaId } = route.params;
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    async function carregar() {
      const dados = await obterOcorrenciaPorId(ocorrenciaId);
      setOcorrencia(dados);
    }
    carregar();
  }, [ocorrenciaId]);

  if (!ocorrencia) {
    return (
      <View style={estilos.tela}>
        <LinearGradient colors={['#0c1733', '#080e1c']} style={estilos.header}>
          <TouchableOpacity style={estilos.btnVoltar} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={estilos.btnVoltarTexto}>←</Text>
          </TouchableOpacity>
          <Text style={estilos.headerTitulo}>Detalhes</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: CORES.textoMuted }}>Carregando...</Text>
        </View>
      </View>
    );
  }

  const corRisco = COR_RISCO[ocorrencia.nivelRisco];
  const ehAutor = usuario?.id === ocorrencia.usuarioId;

  async function confirmarExclusao() {
    setExcluindo(true);
    try {
      await removerOcorrencia(ocorrencia!.id);
      navigation.goBack();
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <View style={estilos.tela}>
      {/* Header */}
      <LinearGradient colors={['#0c1733', '#080e1c']} style={estilos.header}>
        <TouchableOpacity style={estilos.btnVoltar} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={estilos.btnVoltarTexto}>←</Text>
        </TouchableOpacity>
        <View style={estilos.headerCentro}>
          <Text style={estilos.headerEmoji}>{EMOJI_TIPO[ocorrencia.tipo]}</Text>
          <Text style={estilos.headerTitulo} numberOfLines={1}>{LABEL_TIPO[ocorrencia.tipo]}</Text>
        </View>
        <View style={{ width: 38 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <View style={[estilos.heroCard, { borderColor: `${corRisco}55` }]}>
          <View style={estilos.heroTop}>
            <View style={estilos.heroIconeWrap}>
              <Text style={estilos.heroIcone}>{EMOJI_TIPO[ocorrencia.tipo]}</Text>
            </View>
            <BadgeRisco nivel={ocorrencia.nivelRisco} size="lg" />
          </View>
          <Text style={estilos.heroTitulo}>{LABEL_TIPO[ocorrencia.tipo]}</Text>
          <View style={estilos.heroMeta}>
            <Text style={estilos.heroMetaTexto}>{formatarData(ocorrencia.data)}</Text>
            <Text style={estilos.heroMetaSep}>│</Text>
            <Text style={estilos.heroMetaTexto}>{formatarHora(ocorrencia.data)}</Text>
            <Text style={[estilos.heroId]}>{ocorrencia.id}</Text>
          </View>
        </View>

        {/* Grid de metadados */}
        <View style={estilos.metaGrid}>
          <MetaCell icone="📍" label="Localização" value={`${ocorrencia.bairro}\n${ocorrencia.rua}`} />
          <MetaCell icone="👤" label="Registrado por" value={ocorrencia.autorNome} />
          <MetaCell icone="📅" label="Data" value={formatarData(ocorrencia.data)} />
          <MetaCell icone="🕐" label="Hora" value={formatarHora(ocorrencia.data)} />
        </View>

        {/* Divisor */}
        <View style={estilos.divisor} />

        {/* Descrição */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <View style={estilos.labelDot} />
          <Text style={estilos.labelTexto}>Descrição do Risco</Text>
        </View>
        <View style={estilos.descCard}>
          <Text style={estilos.descTexto}>{ocorrencia.descricao}</Text>
        </View>

        {/* Exclusão (somente autor) */}
        {ehAutor && (
          <View style={{ marginTop: 22 }}>
            {!confirmando ? (
              <TouchableOpacity style={estilos.btnDanger} onPress={() => setConfirmando(true)} activeOpacity={0.7}>
                <Text style={estilos.btnDangerTexto}>🗑 Excluir alerta</Text>
              </TouchableOpacity>
            ) : (
              <View style={estilos.confirmCard}>
                <Text style={estilos.confirmTexto}>
                  Excluir este alerta permanentemente?
                </Text>
                <View style={estilos.confirmBotoes}>
                  <TouchableOpacity
                    style={estilos.btnSecundario}
                    onPress={() => setConfirmando(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={estilos.btnSecundarioTexto}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[estilos.btnDanger, { flex: 1, backgroundColor: 'rgba(239,68,68,0.18)' }]}
                    onPress={confirmarExclusao}
                    disabled={excluindo}
                    activeOpacity={0.7}
                  >
                    <Text style={estilos.btnDangerTexto}>🗑 {excluindo ? 'Excluindo...' : 'Excluir'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

function MetaCell({ icone, label, value }: { icone: string; label: string; value: string }) {
  return (
    <View style={{ gap: 6, width: '50%', paddingRight: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Text style={{ fontSize: 12 }}>{icone}</Text>
        <Text style={estilos.metaLabel}>{label}</Text>
      </View>
      <Text style={estilos.metaValor}>{value}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50, paddingBottom: 14,
    paddingHorizontal: ESPACO.md,
    borderBottomWidth: 1, borderBottomColor: CORES.borda,
  },
  btnVoltar: {
    width: 38, height: 38, borderRadius: RAIOS.md,
    backgroundColor: CORES.fundoCard,
    borderWidth: 1, borderColor: CORES.borda,
    alignItems: 'center', justifyContent: 'center',
  },
  btnVoltarTexto: { color: CORES.textoSec, fontSize: 18 },
  headerCentro: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  },
  headerEmoji: { fontSize: 16 },
  headerTitulo: {
    color: CORES.texto, fontSize: 17, fontWeight: '700',
    letterSpacing: 2.4, textTransform: 'uppercase',
  },
  scroll: { padding: ESPACO.md },
  heroCard: {
    backgroundColor: CORES.glass,
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 0,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroIconeWrap: {
    width: 60, height: 60, borderRadius: 16,
    backgroundColor: CORES.fundoInput,
    borderWidth: 1, borderColor: CORES.borda,
    alignItems: 'center', justifyContent: 'center',
  },
  heroIcone: { fontSize: 28 },
  heroTitulo: {
    color: CORES.texto, fontSize: 22, fontWeight: '700',
    marginTop: 16,
  },
  heroMeta: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginTop: 8,
  },
  heroMetaTexto: { color: CORES.textoSec, fontSize: 12, letterSpacing: 0.3 },
  heroMetaSep: { color: CORES.borda },
  heroId: {
    marginLeft: 'auto',
    color: CORES.azulEl, fontSize: 12,
    letterSpacing: 0.3, opacity: 0.7,
  },
  metaGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    rowGap: 18, paddingVertical: 26, paddingHorizontal: 4,
  },
  metaLabel: {
    color: CORES.textoSec, fontSize: 10, fontWeight: '600',
    letterSpacing: 1, textTransform: 'uppercase',
  },
  metaValor: { color: CORES.texto, fontSize: 13.5, lineHeight: 18 },
  divisor: { height: 1, backgroundColor: CORES.borda, marginBottom: 16 },
  labelDot: {
    width: 5, height: 5, borderRadius: 1,
    backgroundColor: CORES.azul,
    shadowColor: CORES.azul, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 2,
  },
  labelTexto: {
    color: CORES.textoSec, fontSize: 11, fontWeight: '600',
    letterSpacing: 1.76, textTransform: 'uppercase',
  },
  descCard: {
    backgroundColor: CORES.glass, borderWidth: 1,
    borderColor: CORES.glassBorda, borderRadius: 14, padding: 16,
  },
  descTexto: { color: CORES.texto, fontSize: 14, lineHeight: 22.4 },
  btnDanger: {
    height: 50, borderRadius: RAIOS.md,
    backgroundColor: CORES.dangerFundo,
    borderWidth: 1, borderColor: CORES.dangerBorda,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
  },
  btnDangerTexto: { color: CORES.dangerTexto, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  confirmCard: {
    backgroundColor: CORES.glass, borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)', borderRadius: 14, padding: 14,
  },
  confirmTexto: {
    color: CORES.textoSec, fontSize: 13, textAlign: 'center', marginBottom: 12,
  },
  confirmBotoes: { flexDirection: 'row', gap: 10 },
  btnSecundario: {
    flex: 1, height: 44, borderRadius: RAIOS.md,
    backgroundColor: CORES.fundoCard,
    borderWidth: 1, borderColor: CORES.borda,
    alignItems: 'center', justifyContent: 'center',
  },
  btnSecundarioTexto: { color: CORES.texto, fontSize: 13, fontWeight: '600' },
});
