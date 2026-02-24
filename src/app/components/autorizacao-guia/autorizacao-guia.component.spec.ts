import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AutorizacaoGuiaComponent } from './autorizacao-guia.component';
import { AutorizacaoService } from '../../services/autorizacao.service';
import { PrestadorService } from '../../services/prestador.service';
import { DadosBeneficiarioStateService } from '../../services/dados-beneficiario-state.service';
import { AutorizacaoStatus, AvaliacaoRegra } from '../../domain/models/autorizacao-resultado.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

describe('AutorizacaoGuiaComponent', () => {

  let component: AutorizacaoGuiaComponent;
  let fixture: ComponentFixture<AutorizacaoGuiaComponent>;

  let autorizacaoServiceSpy: jasmine.SpyObj<AutorizacaoService>;
  let prestadorServiceSpy: jasmine.SpyObj<PrestadorService>;
  let stateSpy: jasmine.SpyObj<DadosBeneficiarioStateService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    autorizacaoServiceSpy = jasmine.createSpyObj('AutorizacaoService', ['simulate']);
    prestadorServiceSpy = jasmine.createSpyObj('PrestadorService', ['listarPrestadores']);
    stateSpy = jasmine.createSpyObj('DadosBeneficiarioStateService', ['getBeneficiario']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AutorizacaoGuiaComponent, ReactiveFormsModule],
      providers: [
        { provide: AutorizacaoService, useValue: autorizacaoServiceSpy },
        { provide: PrestadorService, useValue: prestadorServiceSpy },
        { provide: DadosBeneficiarioStateService, useValue: stateSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
      .overrideComponent(AutorizacaoGuiaComponent, {
        set: {
          imports: [CommonModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(AutorizacaoGuiaComponent);
    component = fixture.componentInstance;
  });

  it('deve carregar dados do beneficiário no ngOnInit', () => {

    stateSpy.getBeneficiario.and.returnValue({
      nome: 'João da Silva',
      numeroCarteira: '1234567890',
      dataNascimento: new Date('1992-02-27'),
      plano: 'Especial',
      dataInicioContrato: new Date('2025-12-01')
    });

    prestadorServiceSpy.listarPrestadores.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.numeroCarteira).toBe('1234567890');
    expect(component.nomeBeneficiario).toBe('João da Silva');
    expect(component.plano).toBe('Especial');
  });

  it('deve listar e ordenar prestadores', () => {

    prestadorServiceSpy.listarPrestadores.and.returnValue(of([
      { codigoPrestador: '01234', nomePrestador: 'Hospital ABC', cnes: '1111' },
      { codigoPrestador: '05678', nomePrestador: 'Laboratório DEF', cnes: '2222' },
      { codigoPrestador: '09123', nomePrestador: 'Clínica GHI', cnes: '3333' }
    ]));

    component.listarPrestadores();

    expect(component.prestadores.length).toBe(4);
    expect(component.prestadores[1].nomePrestador).toBe('Clínica GHI');
  });

  it('deve adicionar procedimento novo', () => {

    const proc = { codigoProcedimento: '201030' } as any;

    component.inserirProcedimento(proc);

    expect(component.procedimentosGuia.length).toBe(1);
    expect(component.exibirDialogInserirProcedimentos).toBeFalse();
  });

  it('deve exibir aviso se procedimento já existir', () => {

    const proc = { codigoProcedimento: '201030' } as any;

    component.procedimentosGuia = [proc];

    component.inserirProcedimento(proc);

    expect(component.mensagemAviso).toBe('Procedimento já adicionado!');
    expect(component.exibirDialogAviso).toBeTrue();
  });

  it('deve remover procedimento existente', () => {

    component.procedimentosGuia = [
      { codigoProcedimento: '201030' } as any
    ];

    component.removerProcedimento('201030');

    expect(component.procedimentosGuia.length).toBe(0);
  });

  it('deve invalidar se não houver carteira', () => {

    component.numeroCarteira = undefined as any;

    const result = component.validarPreenchimentoAutorizacao();

    expect(result).toBeFalse();
  });

  it('deve invalidar se não houver prestador', () => {

    component.numeroCarteira = '1234567890';

    const result = component.validarPreenchimentoAutorizacao();

    expect(result).toBeFalse();
  });

  it('deve invalidar se não houver procedimentos', () => {

    component.numeroCarteira = '1234567890';
    component.formGuia.patchValue({ codigoPrestador: '01234' });

    const result = component.validarPreenchimentoAutorizacao();

    expect(result).toBeFalse();
  });

  it('deve enviar autorização e exibir resultado', async () => {

    component.numeroCarteira = '1234567890';
    component.procedimentosGuia = [{ codigoProcedimento: '201030' } as any];
    component.formGuia.patchValue({ codigoPrestador: '01234' });

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

    autorizacaoServiceSpy.simulate.and.resolveTo(resultadoMock);

    await component.enviarAutorizacao();

    expect(autorizacaoServiceSpy.simulate).toHaveBeenCalled();
    expect(component.exibirDialogResultado).toBeTrue();
    expect(component.result()).toEqual(resultadoMock);
  });

  it('deve navegar ao cancelar preenchimento', () => {
    component.cancelarPreenchimentoGuia();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

});