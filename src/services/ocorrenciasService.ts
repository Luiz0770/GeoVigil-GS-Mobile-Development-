import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ocorrencia } from '../types/ocorrencia';
import { salvar, obter } from './storage';
import { gerarIdAlerta } from '../utils/formatters';

const CHAVE_OCORRENCIAS = '@geovigil:ocorrencias';
const CHAVE_INICIALIZADO = '@geovigil:inicializado';

function gerarMocks(): Ocorrencia[] {
  const agora = new Date();
  const min = 60 * 1000, hr = 60 * min, dia = 24 * hr;

  return [
    {
      id: 'AL-4820',
      usuarioId: 1,
      autorNome: 'Usuário FIAP',
      tipo: 'deslizamento',
      bairro: 'Jardim Ângela',
      rua: 'Encosta da Rua Catequese, próximo ao nº 80',
      descricao: 'Rachaduras novas no barranco depois de 2 dias de chuva contínua. Solo encharcado e pequenos desprendimentos de terra já visíveis sobre o muro de contenção.',
      nivelRisco: 'alto',
      data: new Date(agora.getTime() - 1.5 * hr),
    },
    {
      id: 'AL-4815',
      usuarioId: 1,
      autorNome: 'Usuário FIAP',
      tipo: 'incendio',
      bairro: 'Parque do Carmo',
      rua: 'Trilha leste, próximo ao portão 3',
      descricao: 'Vegetação seca e foco de fumaça avistado ao longe dentro do parque. Tempo seco e vento ajudam a propagação. Bombeiros ainda não acionados no local.',
      nivelRisco: 'medio',
      data: new Date(agora.getTime() - 8 * hr),
    },
    {
      id: 'AL-4805',
      usuarioId: 1,
      autorNome: 'Usuário FIAP',
      tipo: 'enchente',
      bairro: 'Vila Prudente',
      rua: 'Córrego do Oratório, Rua Ibitirama',
      descricao: 'Córrego subindo rápido e bocas de lobo entupidas. Água acumulando na pista e já entrando em garagens no trecho mais baixo da rua.',
      nivelRisco: 'medio',
      data: new Date(agora.getTime() - 2 * dia - 3 * hr),
    },
    {
      id: 'AL-4821',
      usuarioId: 2,
      autorNome: 'Maria Silva',
      tipo: 'enchente',
      bairro: 'Jardim Pantanal',
      rua: 'Margem do Rio Tietê, altura da Rua Antônio Pereira',
      descricao: 'Nível do Rio Tietê subiu cerca de 1m em 3h após chuva forte a montante. Água já cobre a marginal e avança sobre as primeiras ruas. Moradores começando a sair.',
      nivelRisco: 'alto',
      data: new Date(agora.getTime() - 22 * min),
    },
    {
      id: 'AL-4818',
      usuarioId: 2,
      autorNome: 'Maria Silva',
      tipo: 'vendaval',
      bairro: 'Santo Amaro',
      rua: 'Av. Adolfo Pinheiro, 1500',
      descricao: 'Previsão de ventos fortes para as próximas horas. Árvores de grande porte já inclinadas sobre a fiação elétrica, com risco de queda sobre a via.',
      nivelRisco: 'medio',
      data: new Date(agora.getTime() - 5 * hr),
    },
    {
      id: 'AL-4810',
      usuarioId: 2,
      autorNome: 'Maria Silva',
      tipo: 'estiagem',
      bairro: 'Brasilândia',
      rua: 'Reservatório comunitário, Rua Parapuã',
      descricao: 'Nível do reservatório que abastece a comunidade visivelmente baixo após semanas sem chuva. Pressão da água caindo nas casas mais altas da rua.',
      nivelRisco: 'baixo',
      data: new Date(agora.getTime() - dia - 6 * hr),
    },
    {
      id: 'AL-4798',
      usuarioId: 2,
      autorNome: 'Maria Silva',
      tipo: 'deslizamento',
      bairro: 'Sacomã',
      rua: 'Rua dos Mecânicos, encosta sul',
      descricao: 'Pequeno escorregamento de terra na base da encosta, sem atingir residências. Registrado para monitoramento caso a chuva volte nos próximos dias.',
      nivelRisco: 'baixo',
      data: new Date(agora.getTime() - 3 * dia),
    },
  ];
}

export async function inicializarOcorrencias(): Promise<void> {
  const inicializado = await AsyncStorage.getItem(CHAVE_INICIALIZADO);
  if (!inicializado) return;
  const existentes = await AsyncStorage.getItem(CHAVE_OCORRENCIAS);
  if (existentes) return;
  await salvar(CHAVE_OCORRENCIAS, gerarMocks());
}

export async function obterOcorrencias(): Promise<Ocorrencia[]> {
  const raw = await AsyncStorage.getItem(CHAVE_OCORRENCIAS);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as Array<Omit<Ocorrencia, 'data'> & { data: string }>;
  return parsed.map((o) => ({ ...o, data: new Date(o.data) }));
}

export async function obterOcorrenciaPorId(id: string): Promise<Ocorrencia | null> {
  const lista = await obterOcorrencias();
  return lista.find((o) => o.id === id) ?? null;
}

export async function adicionarOcorrencia(
  dados: Omit<Ocorrencia, 'id' | 'data'>
): Promise<Ocorrencia> {
  const id = await gerarIdAlerta();
  const nova: Ocorrencia = { ...dados, id, data: new Date() };
  const lista = await obterOcorrencias();
  await salvar(CHAVE_OCORRENCIAS, [nova, ...lista]);
  return nova;
}

export async function removerOcorrencia(id: string): Promise<void> {
  const lista = await obterOcorrencias();
  await salvar(CHAVE_OCORRENCIAS, lista.filter((o) => o.id !== id));
}
