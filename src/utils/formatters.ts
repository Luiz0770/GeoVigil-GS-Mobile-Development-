import AsyncStorage from '@react-native-async-storage/async-storage';

const MESES = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];

export function formatarData(data: Date): string {
  const d = new Date(data);
  return `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatarHora(data: Date): string {
  const d = new Date(data);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatarRelativo(data: Date): string {
  const diff = Date.now() - new Date(data).getTime();
  const min = 60000, hr = 60 * min, dia = 24 * hr;
  if (diff < hr) return `há ${Math.max(1, Math.round(diff / min))} min`;
  if (diff < dia) return `há ${Math.round(diff / hr)} h`;
  const d = Math.round(diff / dia);
  return `há ${d} ${d === 1 ? 'dia' : 'dias'}`;
}

export function formatarTimestamp(data: Date): string {
  return `${formatarRelativo(data)} · ${formatarData(data)}`;
}

export async function gerarIdAlerta(): Promise<string> {
  const raw = await AsyncStorage.getItem('@geovigil:contadorId');
  const atual = raw ? parseInt(raw, 10) : 4822;
  await AsyncStorage.setItem('@geovigil:contadorId', String(atual + 1));
  return `AL-${atual}`;
}
