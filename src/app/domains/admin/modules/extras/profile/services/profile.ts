import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

export type UserProfile = {
  id: string;
  id_temp: string | null;
  email: string;
  name: string;
  bio: string | null;
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
export class ProfileService {
  private readonly baseUrl = 'http://localhost:3000/api/v1/profile';
  private readonly http = inject(HttpClient);

  getProfile(userId: string): Promise<UserProfile> {
    return firstValueFrom(
      this.http
        .get<ApiResponse<UserProfile>>(`${this.baseUrl}/${userId}`)
        .pipe(map((response) => response.data))
    );
  }

  updateProfile(
    userId: string,
    data: { name?: string; bio?: string }
  ): Promise<UserProfile> {
    return firstValueFrom(
      this.http
        .put<ApiResponse<UserProfile>>(`${this.baseUrl}/${userId}`, data)
        .pipe(map((response) => response.data))
    );
  }
}