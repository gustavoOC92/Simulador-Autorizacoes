import { AutorizacaoRegra } from "./autorizacao-regra.interface";
import { Autorizacao } from "../models/autorizacao.model";
import { ComplexidadePort } from "../ports/complexidade-ports";
import { AutorizacaoResultado } from "../models/autorizacao-resultado.model";

export class ComplexidadeRegra implements AutorizacaoRegra {

    constructor(private complexidadePort: ComplexidadePort) { }

    async evaluate(context: Autorizacao): Promise<AutorizacaoResultado | null> {

        for (const proc of context.procedimentos) {
            const altaComplexidade = await this.complexidadePort.obterComplexidade(proc.codigoProcedimento);

            if (altaComplexidade) {
                return {
                    status: 'EM ESTUDO',
                    motivos: ['Guia com Procedimento de Alta Complexidade'],
                    avaliacoes: [{
                        regra: 'Alta Complexidade',
                        disparada: true
                    }]
                };
            }
        }

        return null;
    }
}