import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Libro } from './libro.model';

interface Envelope<T> {
  data: T;
  pagination?: T;
  message?: string;
  title?: string;
  version?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/books'; // URL de NestJS

  obtenerLibros(): Observable<Libro[]> {
    return this.http
      .get<Envelope<Libro[]>>(this.apiUrl)
      .pipe(map((resp) => resp.data));
  }

  crearLibro(libro: Omit<Libro, 'id'>): Observable<Libro> {
    return this.http
      .post<Envelope<Libro>>(this.apiUrl, libro)
      .pipe(map((resp) => resp.data));
  }

  eliminarLibro(id: number | string): Observable<void> {
    return this.http.delete<Envelope<void>>(`${this.apiUrl}/${id}`).pipe(map(() => undefined));
  }

  actualizarEstado(id: number | string, estado: Libro['estado']): Observable<Libro> {
    return this.http
      .patch<Envelope<Libro>>(`${this.apiUrl}/${id}`, { estado })
      .pipe(map((resp) => resp.data));
  }
}