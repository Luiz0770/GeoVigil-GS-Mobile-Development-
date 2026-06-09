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
import { validarEmail } from '../utils/validators';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

function forcaSenha(senha: string): number {
  let s = 0;
  if (senha.length >= 6) s++;
  if (senha.length >= 10) s++;
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) s++;
  if (/\d/.test(senha) && /[^A-Za-z0-9]/.test(senha)) s++;
  return Math.min(s, 4);
}

const INFO_FORCA = [
  { label: '',         cor: CORES.borda },
  { label: 'Fraca',    cor: '#EF4444' },
  { label: 'Razoável', cor: '#F59E0B' },
  { label: 'Boa',      cor: '#06B6D4' },
  { label: 'Forte',    cor: '#10B981' },
];

export function Cadastro({ navigation }: Props) {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const emailOk = validarEmail(email);
  const forca = forcaSenha(senha);
  const infoForca = INFO_FORCA[forca];
  const senhaOk = forca >= 2;
  const confirmarState = confirmar ? (confirmar === senha ? 'valido' : 'invalido') : null;
  const formularioValido = nome.trim().length >= 3 && emailOk && senhaOk && confirmar === senha && confirmar.length > 0;

  function estadoCampo(ok: boolean | null): 'valido' | 'invalido' | null {
    if (ok === null) return null;
    return ok ? 'valido' : 'invalido';
  }

  const nomeState = nome ? estadoCampo(nome.trim().length >= 3) : null;
  const emailState = email ? estadoCampo(emailOk) : null;
  const senhaState = senha ? estadoCampo(senhaOk) : null;

  function corBorda(state: 'valido' | 'invalido' | null): string {
    if (state === 'valido') return 'rgba(6,182,212,0.5)';
    if (state === 'invalido') return 'rgba(239,68,68,0.6)';
    return CORES.borda;
  }

  async function criarConta() {
    if (!formularioValido) return;
    setCarregando(true);
    setErro('');
    try {
      const ok = await cadastrar(nome, email, senha);
      if (!ok) setErro('Este email já está em uso. Tente outro.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <LinearGradient colors={['#080E1C', '#0D1B35']} style={estilos.fundo}>
      {/* Header customizado */}
      <LinearGradient colors={['#0c1733', '#080e1c']} style={estilos.header}>
        <TouchableOpacity style={estilos.btnVoltar} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={estilos.btnVoltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={estilos.headerTitulo}>Nova Conta</Text>
        <View style={{ width: 38 }} />
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={estilos.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={estilos.descricao}>
            Crie sua conta para registrar e acompanhar alertas de desastres na sua região.
          </Text>

          <View style={estilos.form}>
            {/* Nome */}
            <CampoTexto
              label="Nome completo"
              icone="👤"
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
              state={nomeState}
            />

            {/* Email */}
            <CampoTexto
              label="Email"
              icone="✉️"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              state={emailState}
              mensagem={email && !emailOk ? 'Formato de email inválido' : undefined}
            />

            {/* Senha */}
            <View style={estilos.campo}>
              <Text style={estilos.campoLabel}>Senha</Text>
              <View style={[estilos.inputWrap, { borderColor: corBorda(senhaState) }]}>
                <Text style={estilos.inputIcon}>🔒</Text>
                <TextInput
                  style={estilos.input}
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={CORES.textoMuted}
                  secureTextEntry
                />
                {senhaState === 'valido' && <Text style={estilos.iconValido}>✓</Text>}
                {senhaState === 'invalido' && <Text style={estilos.iconInvalido}>✗</Text>}
              </View>
              {/* Barra de força */}
              <View style={estilos.forcaWrap}>
                {[0, 1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[
                      estilos.forcaSegmento,
                      i < forca
                        ? { backgroundColor: infoForca.cor }
                        : { backgroundColor: CORES.borda },
                    ]}
                  />
                ))}
              </View>
              {!!senha && (
                <Text style={[estilos.forcaLabel, { color: infoForca.cor }]}>
                  Força: {infoForca.label.toUpperCase()}
                </Text>
              )}
            </View>

            {/* Confirmar senha */}
            <CampoTexto
              label="Confirmar senha"
              icone="🔒"
              value={confirmar}
              onChangeText={setConfirmar}
              placeholder="Repita a senha"
              secureTextEntry
              state={confirmarState}
              mensagem={
                confirmarState === 'invalido' ? 'As senhas não coincidem'
                : confirmarState === 'valido' ? 'Senhas conferem'
                : undefined
              }
            />
          </View>

          {!!erro && (
            <Text style={estilos.erroTexto}>✗ {erro}</Text>
          )}

          <View style={{ marginTop: 26, marginBottom: 30 }}>
            <BotaoPrimario
              label="CRIAR CONTA"
              onPress={criarConta}
              disabled={!formularioValido}
              loading={carregando}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

type CampoProps = {
  label: string;
  icone: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  state: 'valido' | 'invalido' | null;
  keyboardType?: 'email-address' | 'default';
  secureTextEntry?: boolean;
  mensagem?: string;
};

function CampoTexto({ label, icone, value, onChangeText, placeholder, state, keyboardType, secureTextEntry, mensagem }: CampoProps) {
  const corB = state === 'valido' ? 'rgba(6,182,212,0.5)' : state === 'invalido' ? 'rgba(239,68,68,0.6)' : CORES.borda;
  return (
    <View style={estilos.campo}>
      <Text style={estilos.campoLabel}>{label}</Text>
      <View style={[estilos.inputWrap, { borderColor: corB }]}>
        <Text style={estilos.inputIcon}>{icone}</Text>
        <TextInput
          style={estilos.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={CORES.textoMuted}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          secureTextEntry={secureTextEntry}
        />
        {state === 'valido' && <Text style={estilos.iconValido}>✓</Text>}
        {state === 'invalido' && <Text style={estilos.iconInvalido}>✗</Text>}
      </View>
      {!!mensagem && (
        <Text style={state === 'invalido' ? estilos.msgInvalida : estilos.msgValida}>
          {state === 'invalido' ? '✗ ' : '✓ '}{mensagem}
        </Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  btnVoltar: {
    width: 38, height: 38,
    borderRadius: RAIOS.md,
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: CORES.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnVoltarTexto: { color: CORES.textoSec, fontSize: 18 },
  headerTitulo: {
    color: CORES.texto,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  scroll: { flexGrow: 1, padding: ESPACO.md },
  descricao: {
    color: CORES.textoSec,
    fontSize: 13,
    lineHeight: 19.5,
    marginBottom: 22,
  },
  form: { gap: 16 },
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
    borderRadius: RAIOS.md,
    paddingHorizontal: 12,
    height: ALTURAS.input,
    gap: 10,
  },
  inputIcon: { fontSize: 16 },
  input: { flex: 1, color: CORES.texto, fontSize: 14 },
  iconValido: { color: '#06B6D4', fontSize: 14, fontWeight: '700' },
  iconInvalido: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
  forcaWrap: {
    flexDirection: 'row',
    gap: 5,
    height: 4,
    marginTop: 6,
  },
  forcaSegmento: {
    flex: 1,
    borderRadius: 2,
  },
  forcaLabel: {
    fontSize: 10.5,
    letterSpacing: 0.63,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  msgInvalida: { color: '#fca5a5', fontSize: 11.5 },
  msgValida: { color: '#67e8f9', fontSize: 11.5 },
  erroTexto: { color: '#fca5a5', fontSize: 12.5, marginTop: 8 },
});
