import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Prestador } from '../domain/models/prestador.model';
import { PrestadorService } from './prestador.service';

describe('PrestadorService', () => {

  let service: PrestadorService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PrestadorService]
    });

    service = TestBed.inject(PrestadorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar prestadores', () => {

    const mockResponse: Prestador[] = [
      { codigoPrestador: '01234', nomePrestador: 'Hospital ABC', cnes: '1111' } as Prestador,
      { codigoPrestador: '05678', nomePrestador: 'Laboratório DEF', cnes: '2222' } as Prestador,
      { codigoPrestador: '09123', nomePrestador: 'Clínica GHI', cnes: '3333' } as Prestador
    ];

    service.listarPrestadores()
      .subscribe(response => {
        expect(response.length).toBe(3);
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(`${apiUrl}/prestadores`);

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

});