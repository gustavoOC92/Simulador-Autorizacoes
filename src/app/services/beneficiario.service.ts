import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beneficiario } from '../domain/models/beneficiario.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficiarioService {

  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  buscarBeneficiario(numeroCarteira: string): Observable<Beneficiario[]> {
    return this.http.get<Beneficiario[]>(`${this.apiUrl}/beneficiarios?numeroCarteira=${numeroCarteira}`)
  }
}
