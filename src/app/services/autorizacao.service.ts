import { Injectable } from '@angular/core';
import { AutorizacaoMotorRegras } from '../domain/motor-regras';
import { CarenciaRegra } from '../domain/regras/carencia-regra';
import { ComplexidadeRegra } from '../domain/regras/complexidade-regra';
import { Autorizacao } from '../domain/models/autorizacao.model';
import { CarenciaHttpAdapter } from './adapters/carencia-http.adapter';
import { ComplexidadeHttpAdapter } from './adapters/complexidade-http.adapter';

@Injectable({
  providedIn: 'root'
})

export class AutorizacaoService {
  
  constructor(
    private carenciaAdapter: CarenciaHttpAdapter,
    private complexidadeAdapter: ComplexidadeHttpAdapter) {}

  async simulate(context: Autorizacao) {
    const motorRegras = new AutorizacaoMotorRegras([
      new CarenciaRegra(this.carenciaAdapter),
      new ComplexidadeRegra(this.complexidadeAdapter)
    ]);

    return await motorRegras.execute(context);
  }
}
