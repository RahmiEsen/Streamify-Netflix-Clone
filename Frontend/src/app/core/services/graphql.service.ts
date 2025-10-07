import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Movie } from '../models/movie.model';
import { GET_BROWSE_DATA, GET_MOVIE_DETAILS } from './movie.queries';

export interface GetMovieDetailsResponse {
  movie: Movie;
}

export interface GetBrowseDataResponse {
  heroMovie: Movie;
  popular: Movie[];
  topRated: Movie[];
  horror: Movie[];
  comedy: Movie[];
  thriller: Movie[];
  crime: Movie[];
  drama: Movie[];
  documentary: Movie[];
}

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {
  constructor(private apollo: Apollo) {}

  getBrowsePageData() {
    return this.apollo.query<GetBrowseDataResponse>({
      query: GET_BROWSE_DATA,
    });
  }

  getMovieDetails(id: number) {
    return this.apollo.query<GetMovieDetailsResponse>({
      query: GET_MOVIE_DETAILS,
      variables: {
        movieId: id,
      },
    });
  }
}
