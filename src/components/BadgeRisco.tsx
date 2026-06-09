import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NivelRisco } from '../types/nivelRisco';

type Props = {
  nivel: NivelRisco;
  size?: 'sm' | 'lg';
};

const CONFIG = {
  baixo: {
    texto:  '#6ee7c0',
    fundo:  'rgba(16,185,129,0.12)',
    borda:  'rgba(16,185,129,0.4)',
    dot:    '#10B981',
    label:  'Baixo',
    shadow: {
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.55,
      shadowRadius: 6,
      elevation: 3,
    },
  },
  medio: {
    texto:  '#fcd081',
    fundo:  'rgba(245,158,11,0.12)',
    borda:  'rgba(245,158,11,0.4)',
    dot:    '#F59E0B',
    label:  'Médio',
    shadow: {
      shadowColor: '#F59E0B',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.55,
      shadowRadius: 6,
      elevation: 3,
    },
  },
  alto: {
    texto:  '#fca5a5',
    fundo:  'rgba(239,68,68,0.12)',
    borda:  'rgba(239,68,68,0.45)',
    dot:    '#EF4444',
    label:  'Alto',
    shadow: {
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.55,
      shadowRadius: 6,
      elevation: 3,
    },
  },
};

export function BadgeRisco({ nivel, size = 'sm' }: Props) {
  const cfg = CONFIG[nivel];
  const altura = size === 'lg' ? 30 : 26;
  const fontSize = size === 'lg' ? 11.5 : 11;
  const paddingH = size === 'lg' ? 13 : 10;

  return (
    <View style={[
      estilos.container,
      {
        height: altura,
        paddingHorizontal: paddingH,
        backgroundColor: cfg.fundo,
        borderColor: cfg.borda,
      },
      cfg.shadow,
    ]}>
      <View style={[estilos.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[estilos.texto, { color: cfg.texto, fontSize }]}>
        Risco {cfg.label}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 7,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  texto: {
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
