import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { CORES } from '../styles/tema';

import { Login } from '../screens/Login';
import { Cadastro } from '../screens/Cadastro';
import { Home } from '../screens/Home';
import { NovaOcorrencia } from '../screens/NovaOcorrencia';
import { DetalhesOcorrencia } from '../screens/DetalhesOcorrencia';
import { MinhasOcorrencias } from '../screens/MinhasOcorrencias';

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Home: undefined;
  NovaOcorrencia: undefined;
  DetalhesOcorrencia: { ocorrenciaId: string };
  MinhasOcorrencias: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: CORES.fundo, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={CORES.azul} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer key={usuario ? `logado-${usuario.id}` : 'publico'}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: CORES.fundo } }}>
        {usuario ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="NovaOcorrencia" component={NovaOcorrencia} />
            <Stack.Screen name="DetalhesOcorrencia" component={DetalhesOcorrencia} />
            <Stack.Screen name="MinhasOcorrencias" component={MinhasOcorrencias} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
