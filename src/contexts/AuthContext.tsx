import React, { createContext, useContext, useEffect, useState } from 'react';
import { Usuario } from '../types/usuario';
import * as authService from '../services/authService';

type AuthContextType = {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verificarSessao() {
      try {
        const logado = await authService.obterUsuarioLogado();
        if (logado) {
          console.log('🔐 Sessão restaurada:', logado.email);
          setUsuario(logado);
        } else {
          console.log('🔓 Nenhuma sessão ativa');
        }
      } finally {
        setLoading(false);
      }
    }
    verificarSessao();
  }, []);

  async function login(email: string, senha: string): Promise<boolean> {
    const resultado = await authService.login(email, senha);
    if (resultado) {
      setUsuario(resultado);
      return true;
    }
    return false;
  }

  async function cadastrar(nome: string, email: string, senha: string): Promise<boolean> {
    const resultado = await authService.cadastrarUsuario(nome, email, senha);
    if (resultado) {
      setUsuario(resultado);
      return true;
    }
    return false;
  }

  async function logout(): Promise<void> {
    await authService.logout();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, loading, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
