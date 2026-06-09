import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { inicializarUsuarios } from './src/services/authService';
import { inicializarOcorrencias } from './src/services/ocorrenciasService';
import Navigation from './src/navigation';

export default function App() {
  useEffect(() => {
    async function inicializarDados() {
      await inicializarUsuarios();
      await inicializarOcorrencias();
    }
    inicializarDados();
  }, []);

  return (
    <AuthProvider>
      <Navigation />
      <StatusBar style="light" />
    </AuthProvider>
  );
}
