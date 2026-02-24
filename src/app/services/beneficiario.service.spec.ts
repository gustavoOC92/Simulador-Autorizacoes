import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Beneficiario } from '../domain/models/beneficiario.model';
import { BeneficiarioService } from './beneficiario.service';

describe('PrestadorService', () => {

  let service: BeneficiarioService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BeneficiarioService]
    });

    service = TestBed.inject(BeneficiarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar beneficiarios', () => {

    const mockResponse: Beneficiario[] = [
      { nome: 'João da Silva', numeroCarteira: '1234567890', dataNascimento: new Date('1992-02-27'), plano: 'Especial', dataInicioContrato: new Date('2025-12-01') } as Beneficiario
    ];

    service.buscarBeneficiario('1234567890')
      .subscribe(response => {
        expect(response.length).toBe(1);
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(`${apiUrl}/beneficiarios?numeroCarteira=1234567890`);

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

});