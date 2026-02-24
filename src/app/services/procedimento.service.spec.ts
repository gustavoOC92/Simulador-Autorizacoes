import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProcedimentoService } from './procedimento.service';
import { Procedimentos } from '../domain/models/procedimentos.model';

describe('ProcedimentoService', () => {

  let service: ProcedimentoService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProcedimentoService]
    });

    service = TestBed.inject(ProcedimentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar procedimentos por tabela', () => {

    const mockResponse: Procedimentos[] = [
      { tabela: 'Procedimentos', codigoProcedimento: '201030', descricaoProcedimento: 'Raio-X', altaComplexidade: false, diasCarencia: 30 } as Procedimentos,
      { tabela: 'Procedimentos', codigoProcedimento: '201040', descricaoProcedimento: 'Tomografia', altaComplexidade: true, diasCarencia: 90 } as Procedimentos,
    ];

    service.listarProcedimentosPorTabela('Procedimentos')
      .subscribe(response => {
        expect(response.length).toBe(2);
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(`${apiUrl}/procedimentos?tabela=Procedimentos`);

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('deve buscar procedimento por código', () => {

    const mockResponse: Procedimentos[] = [
      { tabela: 'Serviços Hospitalares', codigoProcedimento: '102030', descricaoProcedimento: 'Diária Simples', altaComplexidade: false, diasCarencia: 120 } as Procedimentos,
    ];

    service.buscarProcedimentoPorCodigo('102030')
      .subscribe(response => {
        expect(response.length).toBe(1);
        expect(response[0].codigoProcedimento).toBe('102030');
      });

    const req = httpMock.expectOne(`${apiUrl}/procedimentos?codigoProcedimento=102030`);

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

});