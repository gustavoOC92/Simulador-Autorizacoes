import { ProcedimentoAutorizacao } from "./procedimento-autorizacao.model";

export interface Autorizacao {
    numeroCarteira: string;
    codigoPrestador: string;
    procedimentos: ProcedimentoAutorizacao[]
}