import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutorizacaoResultadoComponent } from './autorizacao-resultado.component';
import { AutorizacaoResultado, AutorizacaoStatus, AvaliacaoRegra } from '../../domain/models/autorizacao-resultado.model';

describe('AutorizacaoResultadoComponent', () => {

  let component: AutorizacaoResultadoComponent;
  let fixture: ComponentFixture<AutorizacaoResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutorizacaoResultadoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AutorizacaoResultadoComponent);
    component = fixture.componentInstance;
  });

  it('deve emitir evento ao fechar dialog', () => {

    spyOn(component.onClose, 'emit');

    component.fecharDialog();

    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('deve retornar ícone correto para AUTORIZADO', () => {

    component.retorno = {
      status: 'AUTORIZADO'
    } as AutorizacaoResultado;

    expect(component.classeStatus).toBe('pi pi-check-circle');
  });

  it('deve retornar ícone correto para NEGADO', () => {

    component.retorno = {
      status: 'NEGADO'
    } as AutorizacaoResultado;

    expect(component.classeStatus).toBe('pi pi-times');
  });

  it('deve retornar ícone correto para EM ESTUDO', () => {

    component.retorno = {
      status: 'EM ESTUDO'
    } as AutorizacaoResultado;

    expect(component.classeStatus).toBe('pi pi-exclamation-triangle');
  });

  it('deve retornar undefined para status não mapeado', () => {

    const avaliacaoMock = {
      regra: '',
      disparada: true,
      motivo: ''
    } as AvaliacaoRegra

    const resultadoMock = {
      status: 'OUTRO' as AutorizacaoStatus,
      motivos: ['Autorizado com sucesso'],
      avaliacoes: [avaliacaoMock]
    };

    component.retorno = resultadoMock as AutorizacaoResultado;

    expect(component.classeStatus).toBeUndefined();
  });

});