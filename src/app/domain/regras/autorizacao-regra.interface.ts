import { Autorizacao } from "../models/autorizacao.model";
import { AutorizacaoResultado } from "../models/autorizacao-resultado.model";

export interface AutorizacaoRegra {
  evaluate(context: Autorizacao): Promise<AutorizacaoResultado | null>;
}