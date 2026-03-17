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

  getComunicados(): Observable<Comunicado[]> {
    return this.http.get<Comunicado[]>(this.apiUrl);
  }
}
