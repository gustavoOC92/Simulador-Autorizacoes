import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { AutorizacaoIdentificacaoComponent } from './autorizacao-identificacao.component';
import { BeneficiarioService } from '../../services/beneficiario.service';
import { DadosBeneficiarioStateService } from '../../services/dados-beneficiario-state.service';

describe('AutorizacaoIdentificacaoComponent', () => {

  let component: AutorizacaoIdentificacaoComponent;
  let fixture: ComponentFixture<AutorizacaoIdentificacaoComponent>;

  let beneficiarioServiceSpy: jasmine.SpyObj<BeneficiarioService>;
  let stateServiceSpy: jasmine.SpyObj<DadosBeneficiarioStateService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    beneficiarioServiceSpy = jasmine.createSpyObj('BeneficiarioService', ['buscarBeneficiario']);
    stateServiceSpy = jasmine.createSpyObj('DadosBeneficiarioStateService', ['setBeneficiario']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AutorizacaoIdentificacaoComponent],
      providers: [
        { provide: BeneficiarioService, useValue: beneficiarioServiceSpy },
        { provide: DadosBeneficiarioStateService, useValue: stateServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AutorizacaoIdentificacaoComponent);
    component = fixture.componentInstance;
  });

  it('deve exibir aviso se número da carteira estiver vazio', () => {

    component.numeroCarteira = '';
    component.verificaCarteira();

    expect(component.mensagemAviso).toBe('Informe um número de carteira');
    expect(component.exibirDialogAviso).toBeTrue();
    expect(beneficiarioServiceSpy.buscarBeneficiario).not.toHaveBeenCalled();
  });

  it('deve salvar beneficiário e navegar quando encontrado', () => {

    const mockBeneficiario = {
      nome: 'João da Silva',
      numeroCarteira: '1234567890',
      dataNascimento: new Date('1992-02-27'),
      plano: 'Especial',
      dataInicioContrato: new Date('2025-12-01')
    };

    component.numeroCarteira = '1234567890';

    beneficiarioServiceSpy.buscarBeneficiario.and.returnValue(
      of([mockBeneficiario])
    );

    component.verificaCarteira();

    expect(stateServiceSpy.setBeneficiario).toHaveBeenCalledWith(mockBeneficiario);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/autorizacao-guia']);
  });

  it('deve exibir aviso quando beneficiário não for encontrado', () => {

    component.numeroCarteira = '999';

    beneficiarioServiceSpy.buscarBeneficiario.and.returnValue(
      of([])
    );

    component.verificaCarteira();

    expect(component.mensagemAviso).toBe('Beneficiário não encontrado!');
    expect(component.exibirDialogAviso).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('deve fechar o dialog de aviso', () => {

    component.exibirDialogAviso = true;

    component.fecharDialogAviso();

    expect(component.exibirDialogAviso).toBeFalse();
  });

});