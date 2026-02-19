import { AutorizacaoRegra } from "./autorizacao-regra.interface";
import { Autorizacao } from "../models/autorizacao.model";
import { CarenciaPort } from "../ports/carencia-ports";
import { AutorizacaoResultado } from "../models/autorizacao-resultado.model";

export class CarenciaRegra implements AutorizacaoRegra {

    constructor(private carenciaPort: CarenciaPort) { }

    async evaluate(context: Autorizacao): Promise<AutorizacaoResultado | null> {

        for (const proc of context.procedimentos) {
            const carencia = await this.carenciaPort.obterCarencia(
                proc.codigoProcedimento,
                context.numeroCarteira
            );
            
            if (carencia) {
                return {
                    status: 'NEGADO',
                    motivos: ['Procedimento não coberto pelo plano'],
                    avaliacoes: [{
                        regra: 'Carência',
                        disparada: true
                    }]
                };
            }
        }
        
        return null;
    }
}