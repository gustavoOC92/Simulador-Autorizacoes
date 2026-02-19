import { Injectable } from '@angular/core';
import { ComplexidadePort } from '../../domain/ports/complexidade-ports';
import { ProcedimentoService } from '../procedimento.service';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ComplexidadeHttpAdapter implements ComplexidadePort {

    constructor(private readonly procedimentoService: ProcedimentoService) { }

    async obterComplexidade(codigoProcedimento: string): Promise<boolean> {
        const altaComplexidade = await firstValueFrom(
            this.procedimentoService.buscarProcedimentoPorCodigo(codigoProcedimento)
                .pipe(
                    map(retorno => {
                        const procedimento = retorno.find(p => p.codigoProcedimento === codigoProcedimento);

                        return procedimento!.altaComplexidade
                    })
                )
        )
        
        return altaComplexidade
    }
}