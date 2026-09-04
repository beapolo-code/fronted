import { HttpClient } from '@angular/common/http';
import {
    Injectable,
    inject
} from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

export type Video = {
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    videoId: string;
    category: string;
    subcategory: string | null;
    duration: number | null;
    views: number;
    createdAt?: string;
    updatedAt?: string;
};

type VideoResponse<T> = {
    data: T;
    message?: string;
    title?: string;
    pagination?: unknown;
};

@Injectable({ providedIn: 'root' })
export class VideosService {

    private readonly baseUrl = 'http://localhost:3000/api/v1/videos';
    private readonly http = inject(HttpClient);

    findAll(): Promise<Video[]> {
        return firstValueFrom(
            this.http
                .get<VideoResponse<Video[]>>(this.baseUrl)
                .pipe(map((response) => response.data))
        );
    }

    create(payload: Partial<Video>): Promise<Video> {
        return firstValueFrom(
            this.http
                .post<VideoResponse<Video>>(this.baseUrl, payload)
                .pipe(map((response) => response.data))
        );
    }

    update(
        id: string,
        payload: Partial<Video>
    ): Promise<Video> {
        return firstValueFrom(
            this.http
                .patch<VideoResponse<Video>>(
                    `${this.baseUrl}/${id}`,
                    payload
                )
                .pipe(map((response) => response.data))
        );
    }

    remove(id: string): Promise<void> {
        return firstValueFrom(
            this.http
                .delete<VideoResponse<null>>(`${this.baseUrl}/${id}`)
                .pipe(map(() => undefined))
        );
    }
}