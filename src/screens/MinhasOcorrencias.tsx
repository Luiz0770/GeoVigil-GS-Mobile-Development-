import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../contexts/AuthContext';
import { OcorrenciaCard } from '../components/OcorrenciaCard';
import { BotaoPrimario } from '../components/BotaoPrimario';
import { Ocorrencia } from '../types/ocorrencia';
import { NivelRisco } from '../types/nivelRisco';
import { obterOcorrencias } from '../services/ocorrenciasService';
import { CORES, ESPACO, RAIOS } from '../styles/tema';

type Props = NativeStackScreenProps<RootStackParamList, 'MinhasOcorrencias'>;

const COR_RISCO: Record<NivelRisco, string> = {
  baixo: CORES.riscoBaixo,
  medio: CORES.riscoMedio,
  alto:  CORES.riscoAlto,
};

export function MinhasOcorrencias({ navigation }: Props) {
  const { usuario } = useAuth();
  const [minhas, setMinhas] = useState<Ocorrencia[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const todas = await obterOcorrencias();
        const filtradas = todas
          .filter((o) => o.usuarioId === usuario?.id)
          .sort((a, b) => b.data.getTime() - a.data.getTime());
        setMinhas(filtradas);
      }
      carregar();
    }, [usuario?.id])
  );

  const contagens: Record<NivelRisco, number> = { baixo: 0, medio: 0, alto: 0 };
  minhas.forEach((o) => contagens[o.nivelRisco]++);
  const maxContagem = Math.max(1, ...Object.values(contagens));

  const primeiroNome = usuario?.nome.split(' ')[0] ?? '';

  return (
    <View style={estilos.tela}>
      {/* Header */}
      <LinearGradient colors={['#0c1733', '#080e1c']} style={estilos.header}>
        <TouchableOpacity style={estilos.btnVoltar} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={estilos.btnVoltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={estilos.headerTitulo}>Meus Alertas</Text>
        <View style={{ width: 38 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>
        {/* Card estatísticas */}
        <View style={estilos.statsCard}>
          <View style={estilos.statsTop}>
            <View>
              <Text style={estilos.statsLabel}>Total registrados</Text>
              <Text style={estilos.statsTotal}>{minhas.length}</Text>
            </View>
            <View style={estilos.statsNome}>
              <Text style={estilos.statsNomeTexto}>📊 {primeiroNome}</Text>
            </View>
          </View>

          {/* Mini bar chart */}
          <View style={estilos.barChart}>
            {([['baixo', 'Baixo'], ['medio', 'Médio'], ['alto', 'Alto']] as const).map(([k, lbl]) => (
              <View key={k} style={estilos.barLinha}>
                <Text style={estilos.barLabel}>{lbl}</Text>
                <View style={estilos.barTrack}>
                  <View
                    style={[
                      estilos.barFill,
                      {
                        width: `${(contagens[k] / maxContagem) * 100}%`,
                        backgroundColor: COR_RISCO[k],
                      },
                    ]}
                  />
                </View>
                <Text style={estilos.barContagem}>{contagens[k]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Lista ou vazio */}
        {minhas.length === 0 ? (
          <View style={estilos.vazio}>
            <Text style={estilos.vazioIcone}>🛰️</Text>
            <Text style={estilos.vazioTitulo}>Nenhum alerta registrado</Text>
            <Text style={estilos.vazioSub}>
              Quando você registrar um alerta, ele aparecerá aqui.
            </Text>
            <View style={{ marginTop: 22, width: '100%' }}>
              <BotaoPrimario
                label="Registrar primeiro alerta"
                onPress={() => navigation.navigate('NovaOcorrencia')}
              />
            </View>
          </View>
        ) : (
          <>
            <View style={estilos.historicoLabel}>
              <View style={estilos.labelDot} />
              <Text style={estilos.labelTexto}>Histórico · {minhas.length}</Text>
            </View>
            <View style={{ gap: 12 }}>
              {minhas.map((o) => (
                <OcorrenciaCard
                  key={o.id}
                  ocorrencia={o}
                  onPress={() => navigation.navigate('DetalhesOcorrencia', { ocorrenciaId: o.id })}
                />
              ))}
            </View>
          </>
        )}

        <View style={{ height: 28 }} />
      </ScrollView>
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
  headerTitulo: {
    color: CORES.texto, fontSize: 17, fontWeight: '700',
    letterSpacing: 2.4, textTransform: 'uppercase',
  },
  scroll: { padding: ESPACO.md },
  statsCard: {
    backgroundColor: CORES.glass,
    borderWidth: 1, borderColor: CORES.glassBorda,
    borderRadius: 14, padding: 18,
    marginBottom: 0,
  },
  statsTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: 16,
  },
  statsLabel: {
    color: CORES.textoMuted, fontSize: 10,
    letterSpacing: 1.2, textTransform: 'uppercase',
  },
  statsTotal: {
    color: CORES.texto, fontSize: 38,
    fontWeight: '700', lineHeight: 42,
  },
  statsNome: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  statsNomeTexto: { color: CORES.azulEl, fontSize: 12, fontWeight: '600' },
  barChart: { gap: 9 },
  barLinha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLabel: {
    width: 44, color: CORES.textoSec,
    fontSize: 10.5, fontWeight: '600',
    letterSpacing: 0.63, textTransform: 'uppercase',
  },
  barTrack: {
    flex: 1, height: 8, borderRadius: 4,
    backgroundColor: CORES.fundoInput, overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4 },
  barContagem: {
    width: 18, textAlign: 'right',
    color: CORES.texto, fontSize: 12,
    letterSpacing: 0.3,
  },
  vazio: {
    alignItems: 'center', paddingTop: 54,
    paddingHorizontal: 24, paddingBottom: 20,
  },
  vazioIcone: { fontSize: 64, marginBottom: 18, opacity: 0.4 },
  vazioTitulo: { color: CORES.textoSec, fontSize: 16, fontWeight: '600' },
  vazioSub: {
    color: CORES.textoMuted, fontSize: 13,
    marginTop: 6, lineHeight: 19.5, textAlign: 'center',
  },
  historicoLabel: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginTop: 24, marginBottom: 12,
    marginHorizontal: 2,
  },
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
});
