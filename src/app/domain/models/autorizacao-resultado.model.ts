export type AutorizacaoStatus = 
  | 'AUTORIZADO'
  | 'NEGADO'
  | 'EM ESTUDO';

export interface AvaliacaoRegra {
  regra: string;
  disparada: boolean;
  motivo?: string;
}

export interface AutorizacaoResultado {
  status: AutorizacaoStatus;
  motivos: string[];
  avaliacoes: AvaliacaoRegra[];
}