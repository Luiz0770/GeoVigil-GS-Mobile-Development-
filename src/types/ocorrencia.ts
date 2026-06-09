import { TipoDesastre } from './tipoDesastre';
import { NivelRisco } from './nivelRisco';

export type Ocorrencia = {
  id: string;
  usuarioId: number;
  autorNome: string;
  tipo: TipoDesastre;
  bairro: string;
  rua: string;
  descricao: string;
  nivelRisco: NivelRisco;
  data: Date;
};
