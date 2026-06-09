import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../contexts/AuthContext';
import { BotaoPrimario } from '../components/BotaoPrimario';
import { CORES, ESPACO, RAIOS, ALTURAS } from '../styles/tema';
import { obterCredenciaisTeste } from '../services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function Login({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarCred, setMostrarCred] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [senhaFocus, setSenhaFocus] = useState(false);

  const cred = obterCredenciaisTeste();

  async function entrar() {
    if (!email.trim() || !senha) {
      setErro('Preencha email e senha para continuar.');
      return;
    }
    setCarregando(true);
    setErro('');
    try {
      const ok = await login(email, senha);
      if (!ok) setErro('Credenciais inválidas. Verifique e tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  function preencherAutomatico() {
    setEmail(cred.email);
    setSenha(cred.senha);
    setErro('');
  }

  return (
    <LinearGradient colors={['#080E1C', '#0D1B35']} style={estilos.fundo}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={estilos.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Bloco de marca */}
          <View style={estilos.marca}>
            <View style={estilos.logoWrap}>
              <LinearGradient colors={['#14213f', '#0b1428']} style={estilos.logo}>
                <Text style={estilos.logoEmoji}>🛰️</Text>
              </LinearGradient>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={estilos.titulo}>GEOVIGIL</Text>
              <Text style={estilos.subtitulo}>Alerta Comunitário de Desastres Naturais</Text>
            </View>
          </View>

          {/* Formulário */}
          <View style={estilos.form}>
            {/* Campo email */}
            <View style={estilos.campo}>
              <Text style={estilos.campoLabel}>Email</Text>
              <View style={[estilos.inputWrap, emailFocus && estilos.inputFoco]}>
                <Text style={estilos.inputIcon}>✉️</Text>
                <TextInput
                  style={estilos.input}
                  value={email}
                  onChangeText={(v) => { setEmail(v); setErro(''); }}
                  placeholder="seu@email.com"
                  placeholderTextColor={CORES.textoMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  onSubmitEditing={entrar}
                />
              </View>
            </View>

            {/* Campo senha */}
            <View style={estilos.campo}>
              <Text style={estilos.campoLabel}>Senha</Text>
              <View style={[estilos.inputWrap, senhaFocus && estilos.inputFoco]}>
                <Text style={estilos.inputIcon}>🔒</Text>
                <TextInput
                  style={estilos.input}
                  value={senha}
                  onChangeText={(v) => { setSenha(v); setErro(''); }}
                  placeholder="••••••••"
                  placeholderTextColor={CORES.textoMuted}
                  secureTextEntry
                  onFocus={() => setSenhaFocus(true)}
                  onBlur={() => setSenhaFocus(false)}
                  onSubmitEditing={entrar}
                />
              </View>
            </View>

            {/* Erro */}
            {!!erro && (
              <View style={estilos.erroWrap}>
                <Text style={estilos.erroTexto}>✗ {erro}</Text>
              </View>
            )}

            <BotaoPrimario
              label="ENTRAR"
              onPress={entrar}
              loading={carregando}
            />

            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={estilos.linkWrap}>
              <Text style={estilos.linkTexto}>
                Não tem conta?{' '}
                <Text style={estilos.linkDestaque}>Cadastrar-se</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Chip de credenciais */}
          <View style={estilos.credArea}>
            <TouchableOpacity
              style={estilos.credChip}
              onPress={() => setMostrarCred((v) => !v)}
              activeOpacity={0.7}
            >
              <Text style={estilos.credChipTexto}>📋 Credenciais de teste</Text>
              <Text style={[estilos.credChipTexto, { marginLeft: 4 }]}>
                {mostrarCred ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {mostrarCred && (
              <View style={estilos.credCard}>
                <View style={estilos.credLinha}>
                  <Text style={estilos.credKey}>EMAIL</Text>
                  <Text style={estilos.credVal}>{cred.email}</Text>
                </View>
                <View style={estilos.credLinha}>
                  <Text style={estilos.credKey}>SENHA</Text>
                  <Text style={estilos.credVal}>{cred.senha}</Text>
                </View>
                <TouchableOpacity style={estilos.credBotao} onPress={preencherAutomatico} activeOpacity={0.8}>
                  <Text style={estilos.credBotaoTexto}>Preencher automaticamente</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 28 },
  marca: {
    alignItems: 'center',
    gap: 16,
    marginTop: 80,
    marginBottom: 38,
  },
  logoWrap: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.45)',
  },
  logoEmoji: { fontSize: 28 },
  titulo: {
    color: CORES.texto,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 8.4,
    textTransform: 'uppercase',
    paddingLeft: 8.4,
  },
  subtitulo: {
    color: CORES.textoSec,
    fontSize: 13.5,
    marginTop: 6,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  form: { gap: 14 },
  campo: { gap: 7 },
  campoLabel: {
    color: CORES.textoSec,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.fundoInput,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIOS.md,
    paddingHorizontal: 12,
    height: ALTURAS.input,
    gap: 10,
  },
  inputFoco: {
    borderColor: CORES.azul,
    shadowColor: CORES.azulEl,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: { fontSize: 16 },
  input: {
    flex: 1,
    color: CORES.texto,
    fontSize: 14,
  },
  erroWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  erroTexto: {
    color: '#fca5a5',
    fontSize: 12.5,
  },
  linkWrap: { alignItems: 'center', marginTop: 8 },
  linkTexto: { color: CORES.textoSec, fontSize: 13 },
  linkDestaque: { color: CORES.azulEl, textDecorationLine: 'underline', fontWeight: '500' },
  credArea: {
    paddingTop: 28,
    paddingBottom: 30,
    alignItems: 'flex-start',
  },
  credChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: 'rgba(15,23,42,0.5)',
  },
  credChipTexto: {
    color: CORES.textoMuted,
    fontSize: 11,
    letterSpacing: 0.44,
  },
  credCard: {
    marginTop: 10,
    backgroundColor: CORES.glass,
    borderWidth: 1,
    borderColor: CORES.glassBorda,
    borderRadius: 14,
    padding: 14,
    width: '100%',
    gap: 8,
  },
  credLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  credKey: {
    color: CORES.textoMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  credVal: {
    color: CORES.texto,
    fontSize: 12.5,
    letterSpacing: 0.3,
  },
  credBotao: {
    marginTop: 4,
    height: 40,
    borderRadius: RAIOS.md,
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: CORES.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  credBotaoTexto: {
    color: CORES.texto,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
