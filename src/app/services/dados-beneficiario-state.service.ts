import { Injectable } from '@angular/core';
import { Beneficiario } from '../domain/models/beneficiario.model';

@Injectable({
  providedIn: 'root'
})
export class DadosBeneficiarioStateService {

  private dadosBeneficiario?: Beneficiario;

  setBeneficiario(beneficiario: Beneficiario) {
    this.dadosBeneficiario = beneficiario;
  }

  getBeneficiario(): Beneficiario | undefined {
    return this.dadosBeneficiario;
  }
}
