import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestador } from '../domain/models/prestador.model';

@Injectable({
  providedIn: 'root'
})
export class PrestadorService {

  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  listarPrestadores(): Observable<Prestador[]> {
    return this.http.get<Prestador[]>(`${this.apiUrl}/prestadores`)
  }
}
