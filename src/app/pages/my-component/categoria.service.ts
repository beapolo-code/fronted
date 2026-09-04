import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface CategoriaApi {
  id: string;
  nombre: string;
  descripcion: string;
}

interface Envelope<T> {
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/categories';

  obtenerCategorias(): Observable<CategoriaApi[]> {
    return this.http
      .get<Envelope<CategoriaApi[]>>(this.apiUrl)
      .pipe(map((resp) => resp.data));
  }

  crearCategoria(data: { nombre: string; descripcion?: string }): Observable<CategoriaApi> {
    return this.http
      .post<Envelope<CategoriaApi>>(this.apiUrl, data)
      .pipe(map((resp) => resp.data));
  }
}