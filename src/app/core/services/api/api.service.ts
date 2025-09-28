import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TMDB_CONFIG } from '../../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiKey = TMDB_CONFIG.API_KEY;
  private readonly baseUrl = TMDB_CONFIG.BASE_URL;
  private cache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  get<T>(path: string, options: { params?: HttpParams } = {}): Observable<T> {
    const paramsWithApiKey = (options.params || new HttpParams()).append('api_key', this.apiKey);
    const cacheKey = `${path}?${paramsWithApiKey.toString()}`;

    const cachedResponse = this.cache.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse as T);
    }

    return this.http.get<T>(`${this.baseUrl}/${path}`, { params: paramsWithApiKey }).pipe(
      tap((response) => {
        this.cache.set(cacheKey, response);
      })
    );
  }
}
