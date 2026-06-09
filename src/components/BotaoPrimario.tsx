import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CORES, ALTURAS, RAIOS, SHADOW_AZUL } from '../styles/tema';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  height?: number;
};

export function BotaoPrimario({ label, onPress, disabled = false, loading = false, height = ALTURAS.botao }: Props) {
  const colors = disabled
    ? (['#2a3a5c', '#1e2d4a'] as const)
    : (['#4d8df8', '#3B82F6'] as const);

  return (
    <LinearGradient
      colors={colors}
      style={[estilos.gradiente, { height, opacity: disabled ? 0.4 : 1 }, !disabled && SHADOW_AZUL]}
    >
      <TouchableOpacity
        style={estilos.inner}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={estilos.label}>{label}</Text>
        }
      </TouchableOpacity>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  gradiente: {
    borderRadius: RAIOS.md,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  label: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.56,
    textTransform: 'uppercase',
  },
});
