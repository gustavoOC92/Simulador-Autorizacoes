import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { InserirProcedimentosComponent } from './inserir-procedimentos.component';
import { ProcedimentoService } from '../../services/procedimento.service';
import { Procedimentos } from '../../domain/models/procedimentos.model';
import { Tabela } from '../../domain/models/tabela.model';

describe('InserirProcedimentosComponent', () => {

  let component: InserirProcedimentosComponent;
  let fixture: ComponentFixture<InserirProcedimentosComponent>;
  let procedimentoServiceSpy: jasmine.SpyObj<ProcedimentoService>;

  beforeEach(async () => {

    procedimentoServiceSpy = jasmine.createSpyObj('ProcedimentoService', [
      'listarProcedimentosPorTabela'
    ]);

    await TestBed.configureTestingModule({
      imports: [InserirProcedimentosComponent],
      providers: [
        { provide: ProcedimentoService, useValue: procedimentoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InserirProcedimentosComponent);
    component = fixture.componentInstance;
  });

  it('deve carregar as tabelas no ngOnInit', () => {

    component.ngOnInit();

    expect(component.tabelaProcedimentos.length).toBe(3);
    expect(component.tabelaProcedimentos[0].nomeTabela).toBe('Procedimentos');
  });

  it('deve listar procedimentos e resetar campos', () => {

    const tabelaMock: Tabela = {
      codigoTabela: '01',
      nomeTabela: 'Procedimentos'
    };

    const mockResponse: Procedimentos[] = [
      {
        tabela: 'Procedimentos',
        codigoProcedimento: '201030',
        descricaoProcedimento: 'Raio-X',
        altaComplexidade: false,
        diasCarencia: 30
      } as Procedimentos
    ];

    component.procedimentoSelecionado = mockResponse[0];
    component.quantidadeProcedimento = 5;

    procedimentoServiceSpy.listarProcedimentosPorTabela
      .and.returnValue(of(mockResponse));

    component.listarProcedimentos(tabelaMock);

    expect(procedimentoServiceSpy.listarProcedimentosPorTabela)
      .toHaveBeenCalledWith('Procedimentos');

    expect(component.procedimentos).toEqual(mockResponse);
    expect(component.procedimentoSelecionado).toBeUndefined();
    expect(component.quantidadeProcedimento).toBe(0);
  });

  it('deve filtrar procedimentos pelo início da descrição', () => {

    component.procedimentos = [
      { descricaoProcedimento: 'Raio-X' } as Procedimentos,
      { descricaoProcedimento: 'Tomografia' } as Procedimentos
    ];

    component.filtrarProcedimentos({ query: 'Tomo' } as any);

    expect(component.procedimentosFiltrados.length).toBe(1);
    expect(component.procedimentosFiltrados[0].descricaoProcedimento)
      .toContain('Tomografia');
  });

  it('deve resetar tabelaSelecionada e emitir onClose', () => {

    spyOn(component.onClose, 'emit');

    component.tabelaSelecionada = {
      codigoTabela: '01',
      nomeTabela: 'Procedimentos'
    };

    component.fecharDialog();

    expect(component.tabelaSelecionada).toBeUndefined();
    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('deve emitir procedimentoAutorizacao e resetar estado', () => {

    spyOn(component.procedimentoAutorizacao, 'emit');

    component.procedimentoSelecionado = {
        tabela: 'Procedimentos',
        codigoProcedimento: '201030',
        descricaoProcedimento: 'Raio-X',
        altaComplexidade: false,
        diasCarencia: 30
      } as Procedimentos

    component.quantidadeProcedimento = 3;

    component.inserirProcedimento();

    expect(component.procedimentoAutorizacao.emit).toHaveBeenCalledWith({
      tabelaProcedimento: 'Procedimentos',
      codigoProcedimento: '201030',
      descricaoProcedimento: 'Raio-X',
      quantidadeProcedimento: 3
    });

    expect(component.tabelaSelecionada).toBeUndefined();
    expect(component.procedimentoSelecionado).toBeUndefined();
    expect(component.quantidadeProcedimento).toBe(0);
  });

});