import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ocorrencia } from '../types/ocorrencia';
import { NivelRisco } from '../types/nivelRisco';
import { TipoDesastre } from '../types/tipoDesastre';
import { BadgeRisco } from './BadgeRisco';
import { formatarTimestamp } from '../utils/formatters';
import { CORES } from '../styles/tema';

type Props = {
  ocorrencia: Ocorrencia;
  onPress: () => void;
};

const COR_RISCO: Record<NivelRisco, string> = {
  baixo: CORES.riscoBaixo,
  medio: CORES.riscoMedio,
  alto:  CORES.riscoAlto,
};

const EMOJI_TIPO: Record<TipoDesastre, string> = {
  enchente:     '🌊',
  deslizamento: '🏔️',
  vendaval:     '🌪️',
  incendio:     '🔥',
  estiagem:     '🏜️',
  outro:        '⚠️',
};

const LABEL_TIPO: Record<TipoDesastre, string> = {
  enchente:     'Enchente',
  deslizamento: 'Deslizamento',
  vendaval:     'Vendaval',
  incendio:     'Incêndio',
  estiagem:     'Estiagem',
  outro:        'Outro',
};

export function OcorrenciaCard({ ocorrencia, onPress }: Props) {
  const corBorda = COR_RISCO[ocorrencia.nivelRisco];

  return (
    <TouchableOpacity
      style={[estilos.card, { borderLeftColor: corBorda }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Linha 1: tipo + badge */}
      <View style={estilos.linhaTop}>
        <View style={estilos.tipo}>
          <Text style={estilos.tipoEmoji}>{EMOJI_TIPO[ocorrencia.tipo]}</Text>
          <Text style={estilos.tipoTexto}>{LABEL_TIPO[ocorrencia.tipo]}</Text>
        </View>
        <BadgeRisco nivel={ocorrencia.nivelRisco} size="sm" />
      </View>

      {/* Linha 2: localização */}
      <View style={estilos.meta}>
        <Text style={estilos.pin}>📍</Text>
        <Text style={estilos.metaTexto} numberOfLines={1}>
          <Text style={estilos.bairroNegrito}>{ocorrencia.bairro}</Text>
          {' · '}{ocorrencia.rua}
        </Text>
      </View>

      {/* Linha 3: descrição */}
      <Text style={estilos.descricao} numberOfLines={2}>
        {ocorrencia.descricao}
      </Text>

      {/* Linha 4: timestamp + ID */}
      <View style={estilos.linhaBaixo}>
        <Text style={estilos.tempo}>
          🕐 {formatarTimestamp(ocorrencia.data)}
        </Text>
        <Text style={estilos.id}>{ocorrencia.id}</Text>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: CORES.glass,
    borderWidth: 1,
    borderColor: CORES.glassBorda,
    borderLeftWidth: 4,
    borderRadius: 12,
    paddingVertical: 13,
    paddingLeft: 15,
    paddingRight: 14,
  },
  linhaTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  tipo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  tipoEmoji: {
    fontSize: 16,
  },
  tipoTexto: {
    color: CORES.texto,
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  pin: {
    fontSize: 12,
  },
  metaTexto: {
    color: CORES.textoSec,
    fontSize: 12.5,
    flex: 1,
  },
  bairroNegrito: {
    color: CORES.texto,
    fontWeight: '600',
  },
  descricao: {
    color: CORES.textoSec,
    fontSize: 13,
    lineHeight: 18.85,
    marginTop: 7,
    marginBottom: 10,
  },
  linhaBaixo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tempo: {
    color: CORES.textoMuted,
    fontSize: 11,
    letterSpacing: 0.44,
  },
  id: {
    color: CORES.azulEl,
    fontSize: 10.5,
    letterSpacing: 0.63,
    opacity: 0.65,
  },
});
