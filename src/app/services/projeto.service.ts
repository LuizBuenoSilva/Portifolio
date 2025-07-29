// src/app/services/projeto.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Projeto } from '../models/projeto.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjetoService {
  private apiUrl = 'http://localhost:8080/api/projetos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.apiUrl);
  }

  salvar(projeto: Projeto): Observable<Projeto> {
    return this.http.post<Projeto>(this.apiUrl, projeto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
