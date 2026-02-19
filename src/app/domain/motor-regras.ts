import { AutorizacaoRegra } from "./regras/autorizacao-regra.interface";
import { Autorizacao } from "./models/autorizacao.model";
import { AutorizacaoResultado } from "./models/autorizacao-resultado.model";

export class AutorizacaoMotorRegras {

    constructor(private regras: AutorizacaoRegra[]) { }

    async execute(context: Autorizacao): Promise<AutorizacaoResultado> {
        for (const regra of this.regras) {
            console.log('Executando regra:', regra.constructor.name);
            const resultado = await regra.evaluate(context);
            console.log('Resultado regra: ', resultado)
            if (resultado) {
                return resultado;
            }
        }

        return {
            status: 'AUTORIZADO',
            motivos: ['Solicitação Autorizada'],
            avaliacoes: []
        };
    }
}