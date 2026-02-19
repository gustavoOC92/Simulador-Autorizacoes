import { TestBed } from '@angular/core/testing';

import { DadosBeneficiarioStateService } from './dados-beneficiario-state.service';

describe('DadosBeneficiarioStateService', () => {
  let service: DadosBeneficiarioStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DadosBeneficiarioStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
