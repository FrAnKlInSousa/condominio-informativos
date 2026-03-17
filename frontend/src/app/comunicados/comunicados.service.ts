import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comunicado } from '../models/comunicado';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComunicadosService {
  private apiUrl = 'http://localhost:3000/comunicados';

  constructor(private http: HttpClient) {}
  createComunicado(data: { titulo: string; descricao: string; data: string }) {
    return this.http.post(this.apiUrl, data);
  }

  getComunicados(): Observable<Comunicado[]> {
    return this.http.get<Comunicado[]>(this.apiUrl);
  }

  deleteComunicado(id: number) {
    return this.http.patch(`${this.apiUrl}/${id}/delete`, {});
  }

  updateComunicado(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
