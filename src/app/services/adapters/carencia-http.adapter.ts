import { Injectable } from '@angular/core';
import { CarenciaPort } from '../../domain/ports/carencia-ports';
import { ProcedimentoService } from '../procedimento.service';
import { BeneficiarioService } from '../beneficiario.service';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CarenciaHttpAdapter implements CarenciaPort {

    constructor(
        private readonly procedimentoService: ProcedimentoService,
        private readonly beneficiarioService: BeneficiarioService) { }

    async obterCarencia(codigoProcedimento: string, numeroCarteira: string): Promise<boolean> {
        const diasCarencia = await firstValueFrom(
            this.procedimentoService.buscarProcedimentoPorCodigo(codigoProcedimento)
                .pipe(
                    map(retorno => {
                        const procedimento = retorno.find(p => p.codigoProcedimento === codigoProcedimento);

                        return procedimento!.diasCarencia
                    })
                )
        )
        
        const dataInicioContrato = await firstValueFrom(
            this.beneficiarioService.buscarBeneficiario(numeroCarteira)
                .pipe(
                    map(retorno => {
                        const beneficiario = retorno.find(p => p.numeroCarteira === numeroCarteira);

                        return beneficiario!.dataInicioContrato
                    })
                )
        )
        
        const hoje = new Date()
        let dataFimCarencia = this.calcularDataFimCarencia(dataInicioContrato, diasCarencia)
        
        if (hoje < dataFimCarencia) {
            return true
        }

        return false
    }

    calcularDataFimCarencia(dataInicioContrato: Date, diasCarencia: number) {
        const dataFim = new Date(dataInicioContrato);
        dataFim.setDate(dataFim.getDate() + diasCarencia);
        return dataFim;
    }
}