import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

export type Favorito = {
  id: string;
  bookId: string;
  titulo: string;
  autor: string;
  categoria: string;
  imagen: string;
  estado: string;
  createdAt?: string;
};

type ApiResponse<T> = {
  data: T;
  message?: string;
  title?: string;
  pagination?: unknown;
};

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly baseUrl = 'http://localhost:3000/api/v1/favorites';
  private readonly http = inject(HttpClient);

  findAll(): Promise<Favorito[]> {
    return firstValueFrom(
      this.http
        .get<ApiResponse<Favorito[]>>(this.baseUrl)
        .pipe(map((response) => response.data))
    );
  }

  toggle(bookId: string): Promise<{ isFavorite: boolean }> {
    return firstValueFrom(
      this.http
        .post<ApiResponse<{ isFavorite: boolean }>>(
          `${this.baseUrl}/${bookId}/toggle`,
          null
        )
        .pipe(map((response) => response.data))
    );
  }

  remove(bookId: string): Promise<void> {
    return firstValueFrom(
      this.http
        .delete<ApiResponse<null>>(`${this.baseUrl}/${bookId}`)
        .pipe(map(() => undefined))
    );
  }
}