import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from './libro.model';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/books'; // URL de NestJS

  obtenerLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  crearLibro(libro: Omit<Libro, 'id'>): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, libro);
  }

  eliminarLibro(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarEstado(id: number | string, estado: string): Observable<Libro> {
    return this.http.patch<Libro>(`${this.apiUrl}/${id}`, { estado });
  }
}