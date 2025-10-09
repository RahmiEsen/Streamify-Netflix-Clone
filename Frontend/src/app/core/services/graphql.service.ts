import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Media, Movie, Series } from '../models/media.model';
import {
  GET_POPULAR_MEDIA,
  GET_TOP_RATED_MEDIA,
  GET_MEDIA_BY_GENRE,
  GET_HERO_MEDIA,
  GET_MEDIA_BY_ID,
} from './media.queries';

type MediaList = (Movie | Series)[];

export const isMovie = (m: Media): m is Movie => m.__typename === 'Movie';
export const isSeries = (m: Media): m is Series => m.__typename === 'Series';

export const GENRE_IDS = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
};

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {
  constructor(private apollo: Apollo) {}

  getPopularMedia(): Observable<MediaList> {
    return this.apollo
      .watchQuery<{ popularMedia: MediaList }>({
        query: GET_POPULAR_MEDIA,
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      })
      .valueChanges.pipe(
        map((res) => res.data.popularMedia ?? []),
        catchError((err) => {
          console.error('[GraphQL] getPopularMedia error:', err);
          return of([]);
        }),
      );
  }

  getTopRatedMedia(): Observable<MediaList> {
    return this.apollo
      .watchQuery<{ topRatedMedia: MediaList }>({
        query: GET_TOP_RATED_MEDIA,
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      })
      .valueChanges.pipe(
        map((res) => res.data.topRatedMedia ?? []),
        catchError((err) => {
          console.error('[GraphQL] getTopRatedMedia error:', err);
          return of([]);
        }),
      );
  }

  getHeroMedia(): Observable<Movie | Series | null> {
    return this.apollo
      .watchQuery<{ heroMedia: Movie | Series }>({
        query: GET_HERO_MEDIA,
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      })
      .valueChanges.pipe(
        map((res) => res.data.heroMedia ?? null),
        catchError((err) => {
          console.error('[GraphQL] getHeroMedia error:', err);
          return of(null);
        }),
      );
  }

  getMediaByGenre(genreId: number): Observable<MediaList> {
    return this.apollo
      .watchQuery<{ mediaByGenre: MediaList }>({
        query: GET_MEDIA_BY_GENRE,
        variables: { genreId },
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      })
      .valueChanges.pipe(
        map((res) => res.data.mediaByGenre ?? []),
        catchError((err) => {
          console.error(`[GraphQL] getMediaByGenre(${genreId}) error:`, err);
          return of([]);
        }),
      );
  }

  getMediaById(
    id: number,
    mediaType: 'movie' | 'tv',
  ): Observable<Movie | Series | null> {
    return this.apollo
      .watchQuery<{ mediaById: Movie | Series }>({
        query: GET_MEDIA_BY_ID,
        variables: { id, mediaType },
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      })
      .valueChanges.pipe(
        map((res) => res.data.mediaById ?? null),
        catchError((err) => {
          console.error(
            `[GraphQL] getMediaById(${id}, ${mediaType}) error:`,
            err,
          );
          return of(null);
        }),
      );
  }

  getPopularMovies(): Observable<Movie[]> {
    return this.getPopularMedia().pipe(map((list) => list.filter(isMovie)));
  }

  getTopRatedMovies(): Observable<Movie[]> {
    return this.getTopRatedMedia().pipe(map((list) => list.filter(isMovie)));
  }

  getMoviesByGenre(genreId: number): Observable<Movie[]> {
    return this.getMediaByGenre(genreId).pipe(
      map((list) => list.filter(isMovie)),
    );
  }

  getPopularSeries(): Observable<Series[]> {
    return this.getPopularMedia().pipe(map((list) => list.filter(isSeries)));
  }

  getTopRatedSeries(): Observable<Series[]> {
    return this.getTopRatedMedia().pipe(map((list) => list.filter(isSeries)));
  }

  getSeriesByGenre(genreId: number): Observable<Series[]> {
    return this.getMediaByGenre(genreId).pipe(
      map((list) => list.filter(isSeries)),
    );
  }
}
