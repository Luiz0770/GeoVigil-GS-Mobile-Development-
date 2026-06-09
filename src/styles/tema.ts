export const CORES = {
  fundo:       '#080E1C',
  fundoCard:   '#0F1729',
  fundoInput:  '#0B1322',
  borda:       '#1E2D4A',
  glass:       'rgba(15, 23, 42, 0.7)',
  glassBorda:  'rgba(59, 130, 246, 0.2)',

  azul:        '#3B82F6',
  azulEl:      '#60A5FA',
  ciano:       '#06B6D4',

  riscoBaixo:  '#10B981',
  riscoMedio:  '#F59E0B',
  riscoAlto:   '#EF4444',

  texto:       '#F1F5F9',
  textoSec:    '#94A3B8',
  textoMuted:  '#64748B',

  dangerTexto: '#fda4a4',
  dangerBorda: 'rgba(239, 68, 68, 0.4)',
  dangerFundo: 'rgba(239, 68, 68, 0.08)',
};

export const FONTES = {
  titulo:     'SpaceGrotesk-Bold',
  tituloSemi: 'SpaceGrotesk-SemiBold',
  corpo:      'Inter-Regular',
  corpoMed:   'Inter-Medium',
  mono:       'IBMPlexMono-Regular',
};

export const TIPO = {
  screenTitle: { fontSize: 17, fontWeight: '700' as const, letterSpacing: 2.4, textTransform: 'uppercase' as const },
  eyebrow:     { fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase' as const },
  label:       { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.76, textTransform: 'uppercase' as const },
  fieldLabel:  { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.1, textTransform: 'uppercase' as const },
  body:        { fontSize: 14, lineHeight: 21 },
  bodySm:      { fontSize: 13, lineHeight: 18.85 },
  bodyXs:      { fontSize: 12.5 },
  mono:        { fontSize: 11, letterSpacing: 0.44 },
  monoSm:      { fontSize: 10.5, letterSpacing: 0.63 },
};

export const RAIOS = { sm: 8, md: 10, lg: 12, xl: 14, fab: 17 };
export const ESPACO = { xs: 8, sm: 12, md: 18, lg: 24, xl: 32 };

export const ALTURAS = {
  input:    48,
  botao:    50,
  botaoSm:  44,
  chip:     32,
  segBtn:   46,
  typeCard: 78,
  iconBtn:  38,
  fab:      58,
};

export const SHADOW_AZUL = {
  shadowColor: '#3B82F6',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.8,
  shadowRadius: 16,
  elevation: 10,
};

export const SHADOW_ALTO = {
  shadowColor: '#EF4444',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.5,
  shadowRadius: 12,
  elevation: 6,
};

export const SHADOW_MEDIO = {
  shadowColor: '#F59E0B',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.5,
  shadowRadius: 12,
  elevation: 6,
};

export const SHADOW_BAIXO = {
  shadowColor: '#10B981',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.5,
  shadowRadius: 12,
  elevation: 6,
};
