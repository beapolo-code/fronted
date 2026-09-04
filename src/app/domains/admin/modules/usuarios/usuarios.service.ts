import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

export type Usuario = {
  id: string;
  id_temp: string | null;
  email: string;
  name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
};

type ApiResponse<T> = {
  data: T;
  message?: string;
  title?: string;
  pagination?: unknown;
};

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl = 'http://localhost:3000/api/v1/users';
  private readonly http = inject(HttpClient);

  findAll(): Promise<Usuario[]> {
    return firstValueFrom(
      this.http
        .get<ApiResponse<Usuario[]>>(this.baseUrl)
        .pipe(map((response) => response.data))
    );
  }

  create(payload: Partial<Usuario> & { password?: string }): Promise<Usuario> {
    return firstValueFrom(
      this.http
        .post<ApiResponse<Usuario>>(this.baseUrl, payload)
        .pipe(map((response) => response.data))
    );
  }

  update(id: string, payload: Partial<Usuario> & { password?: string }): Promise<Usuario> {
    return firstValueFrom(
      this.http
        .patch<ApiResponse<Usuario>>(`${this.baseUrl}/${id}`, payload)
        .pipe(map((response) => response.data))
    );
  }

  setActive(id: string, isActive: boolean): Promise<Usuario> {
    return firstValueFrom(
      this.http
        .patch<ApiResponse<Usuario>>(`${this.baseUrl}/${id}/activate`, { isActive })
        .pipe(map((response) => response.data))
    );
  }

  remove(id: string): Promise<void> {
    return firstValueFrom(
      this.http
        .delete<ApiResponse<null>>(`${this.baseUrl}/${id}`)
        .pipe(map(() => undefined))
    );
  }
}