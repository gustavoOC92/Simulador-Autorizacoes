import { TestBed } from '@angular/core/testing';
import { AutorizacaoService } from './autorizacao.service';
import { CarenciaHttpAdapter } from './adapters/carencia-http.adapter';
import { ComplexidadeHttpAdapter } from './adapters/complexidade-http.adapter';
import { AutorizacaoMotorRegras } from '../domain/motor-regras';
import { Autorizacao } from '../domain/models/autorizacao.model';
import { AutorizacaoStatus, AvaliacaoRegra } from '../domain/models/autorizacao-resultado.model';
import { ProcedimentoAutorizacao } from '../domain/models/procedimento-autorizacao.model';

describe('AutorizacaoService', () => {

  let service: AutorizacaoService;

  let carenciaAdapterSpy: jasmine.SpyObj<CarenciaHttpAdapter>;
  let complexidadeAdapterSpy: jasmine.SpyObj<ComplexidadeHttpAdapter>;

  beforeEach(() => {

    carenciaAdapterSpy = jasmine.createSpyObj('CarenciaHttpAdapter', ['verificar']);
    complexidadeAdapterSpy = jasmine.createSpyObj('ComplexidadeHttpAdapter', ['verificar']);

    TestBed.configureTestingModule({
      providers: [
        AutorizacaoService,
        { provide: CarenciaHttpAdapter, useValue: carenciaAdapterSpy },
        { provide: ComplexidadeHttpAdapter, useValue: complexidadeAdapterSpy }
      ]
    });

    service = TestBed.inject(AutorizacaoService);
  });

  it('deve executar o motor de regras e retornar o resultado Autorizado', async () => {

    const procedimentoMock: ProcedimentoAutorizacao[] = [
          { tabelaProcedimento: 'Procedimentos', codigoProcedimento: '201030', descricaoProcedimento: 'Raio-X', quantidadeProcedimento: 1 } as ProcedimentoAutorizacao
    ];

    const contextoMock = { numeroCarteira: '1234567890', codigoPrestador: '01234', procedimentos: procedimentoMock } as Autorizacao;

    const avaliacaoMock = {
      regra: '',
      disparada: true,
      motivo: ''
    } as AvaliacaoRegra

    const resultadoMock = {
      status: 'AUTORIZADO' as AutorizacaoStatus,
      motivos: ['Autorizado com sucesso'],
      avaliacoes: [avaliacaoMock]
    };

    const executeSpy = spyOn(
      AutorizacaoMotorRegras.prototype,
      'execute'
    ).and.resolveTo(resultadoMock);

    const resultado = await service.simulate(contextoMock);

    expect(executeSpy).toHaveBeenCalledWith(contextoMock);
    expect(resultado).toEqual(resultadoMock);
  });

  it('deve executar o motor de regras e retornar o resultado Em Estudo', async () => {

    const procedimentoMock: ProcedimentoAutorizacao[] = [
          { tabelaProcedimento: 'Procedimentos', codigoProcedimento: '201040', descricaoProcedimento: 'Tomografia', quantidadeProcedimento: 1 } as ProcedimentoAutorizacao
    ];

    const contextoMock = { numeroCarteira: '1234567890', codigoPrestador: '01234', procedimentos: procedimentoMock } as Autorizacao;

    const avaliacaoMock = {
      regra: 'Alta Complexidade',
      disparada: true,
      motivo: 'Guia com Procedimento de Alta Complexidade'
    } as AvaliacaoRegra

    const resultadoMock = {
      status: 'EM ESTUDO' as AutorizacaoStatus,
      motivos: ['Guia com Procedimento de Alta Complexidade'],
      avaliacoes: [avaliacaoMock]
    };

    const executeSpy = spyOn(
      AutorizacaoMotorRegras.prototype,
      'execute'
    ).and.resolveTo(resultadoMock);

    const resultado = await service.simulate(contextoMock);

    expect(executeSpy).toHaveBeenCalledWith(contextoMock);
    expect(resultado).toEqual(resultadoMock);
  });

  it('deve executar o motor de regras e retornar o resultado Negado', async () => {

    const procedimentoMock: ProcedimentoAutorizacao[] = [
          { tabelaProcedimento: 'Procedimentos', codigoProcedimento: '201040', descricaoProcedimento: 'Tomografia', quantidadeProcedimento: 1 } as ProcedimentoAutorizacao
    ];

    const contextoMock = { numeroCarteira: '1234567890', codigoPrestador: '01234', procedimentos: procedimentoMock } as Autorizacao;

    const avaliacaoMock = {
      regra: 'Carência',
      disparada: true,
      motivo: 'Procedimento não coberto pelo plano'
    } as AvaliacaoRegra

    const resultadoMock = {
      status: 'NEGADO' as AutorizacaoStatus,
      motivos: ['Procedimento não coberto pelo plano'],
      avaliacoes: [avaliacaoMock]
    };

    const executeSpy = spyOn(
      AutorizacaoMotorRegras.prototype,
      'execute'
    ).and.resolveTo(resultadoMock);

    const resultado = await service.simulate(contextoMock);

    expect(executeSpy).toHaveBeenCalledWith(contextoMock);
    expect(resultado).toEqual(resultadoMock);
  });

});