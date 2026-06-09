import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types/usuario';
import { salvar, obter } from './storage';

const CHAVE_USUARIOS = '@geovigil:usuarios';
const CHAVE_LOGADO = '@geovigil:usuarioLogado';
const CHAVE_INICIALIZADO = '@geovigil:inicializado';

const USUARIOS_INICIAIS: Usuario[] = [
  { id: 1, nome: 'Usuário FIAP', email: 'fiap@teste.com', senha: '123456' },
  { id: 2, nome: 'Maria Silva',  email: 'maria@teste.com', senha: '123456' },
];

export function obterCredenciaisTeste() {
  return { email: 'fiap@teste.com', senha: '123456' };
}

export async function inicializarUsuarios(): Promise<void> {
  const inicializado = await AsyncStorage.getItem(CHAVE_INICIALIZADO);
  if (inicializado) return;
  await salvar(CHAVE_USUARIOS, USUARIOS_INICIAIS);
  await AsyncStorage.setItem(CHAVE_INICIALIZADO, 'true');
}

export async function login(email: string, senha: string): Promise<Usuario | null> {
  const usuarios = await obter<Usuario[]>(CHAVE_USUARIOS) ?? [];
  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.senha === senha
  );
  if (!usuario) return null;
  await salvar(CHAVE_LOGADO, usuario);
  return usuario;
}

export async function cadastrarUsuario(
  nome: string,
  email: string,
  senha: string
): Promise<Usuario | null> {
  const usuarios = await obter<Usuario[]>(CHAVE_USUARIOS) ?? [];
  const existe = usuarios.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existe) return null;
  const novoId = usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 3;
  const novo: Usuario = { id: novoId, nome: nome.trim(), email: email.trim().toLowerCase(), senha };
  await salvar(CHAVE_USUARIOS, [...usuarios, novo]);
  await salvar(CHAVE_LOGADO, novo);
  return novo;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(CHAVE_LOGADO);
}

export async function obterUsuarioLogado(): Promise<Usuario | null> {
  return obter<Usuario>(CHAVE_LOGADO);
}
