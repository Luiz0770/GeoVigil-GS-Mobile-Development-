import AsyncStorage from '@react-native-async-storage/async-storage';

export async function salvar<T>(key: string, valor: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(valor));
}

export async function obter<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}
