import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Procedimentos } from '../domain/models/procedimentos.model';

@Injectable({
  providedIn: 'root'
})
export class ProcedimentoService {

  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  listarProcedimentosPorTabela(tabela: string): Observable<Procedimentos[]> {
    return this.http.get<Procedimentos[]>(`${this.apiUrl}/procedimentos?tabela=${tabela}`)
  }

  buscarProcedimentoPorCodigo(codigoProcedimento: string): Observable<Procedimentos[]> {
    return this.http.get<Procedimentos[]>(`${this.apiUrl}/procedimentos?codigoProcedimento=${codigoProcedimento}`)
  }
}
