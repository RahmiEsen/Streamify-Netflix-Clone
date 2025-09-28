import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse, Movie, EnrichedMovie, Keyword } from '../../models/movie.model';
import { TMDB_CONFIG } from '../../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class MovieApiService {
  constructor(private apiService: ApiService) {}

  private getDefaultDiscoveryParams(): HttpParams {
    return new HttpParams().set('language', 'de-DE').set('sort_by', 'popularity.desc');
  }

  public getPopularMovies(): Observable<Movie[]> {
    const params = this.getDefaultDiscoveryParams();
    return this.apiService
      .get<ApiResponse<Movie>>('discover/movie', { params })
      .pipe(map((response) => response.results));
  }

  public getTopRatedMovies(): Observable<Movie[]> {
    const params = this.getDefaultDiscoveryParams()
      .set('sort_by', 'vote_average.desc')
      .set('vote_count.gte', '2000');
    return this.apiService
      .get<ApiResponse<Movie>>('discover/movie', { params })
      .pipe(map((response) => response.results));
  }

  public getMoviesByGenre(genreId: number | string): Observable<Movie[]> {
    const params = this.getDefaultDiscoveryParams().set('with_genres', genreId.toString());
    return this.apiService
      .get<ApiResponse<Movie>>('discover/movie', { params })
      .pipe(map((response) => response.results));
  }

  public getMovieDetails(movieId: number): Observable<EnrichedMovie> {
    const params = new HttpParams()
      .set('append_to_response', 'images,release_dates,keywords')
      .set('language', 'de-DE');
    return this.apiService.get<any>(`movie/${movieId}`, { params }).pipe(
      map((response) => {
        let certification = '';
        const releaseDatesDE = response.release_dates?.results?.find(
          (r: any) => r.iso_3166_1 === 'DE'
        );
        if (releaseDatesDE?.release_dates) {
          certification =
            releaseDatesDE.release_dates.find((rd: any) => rd.certification)?.certification || '';
        }

        const bestLogo =
          response.images?.logos?.find((l: any) => l.iso_639_1 === 'en') ||
          response.images?.logos?.[0];

        const keywords = (response.keywords?.keywords || []).slice(0, 3);

        return {
          ...response,
          logoUrl: bestLogo ? TMDB_CONFIG.IMG_URL + bestLogo.file_path : undefined,
          certification: certification,
          keywords: keywords,
        };
      })
    );
  }
}
