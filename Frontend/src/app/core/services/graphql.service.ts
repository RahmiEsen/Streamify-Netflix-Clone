import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Movie } from '../models/movie.model';

export interface GetMovieDetailsResponse {
  movie: Movie;
}

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {
  constructor(private apollo: Apollo) {}

  getBrowsePageData() {
    const MOVIE_FRAGMENT = gql`
      fragment MovieFragment on Movie {
        id
        title
        overview
        posterUrl
        backdropUrl
        fsk
        genres
        logoUrl
      }
    `;
    const GET_BROWSE_DATA = gql`
      ${MOVIE_FRAGMENT}

      query GetBrowsePageData {
        popular: popularMovies {
          ...MovieFragment
        }
        topRated: topRatedMovies {
          ...MovieFragment
        }
        horror: moviesByGenre(genreId: 27) {
          ...MovieFragment
        }
        comedy: moviesByGenre(genreId: 35) {
          ...MovieFragment
        }
        thriller: moviesByGenre(genreId: 53) {
          ...MovieFragment
        }
        crime: moviesByGenre(genreId: 80) {
          ...MovieFragment
        }
        drama: moviesByGenre(genreId: 18) {
          ...MovieFragment
        }
        documentary: moviesByGenre(genreId: 99) {
          ...MovieFragment
        }
      }
    `;

    return this.apollo.query({
      query: GET_BROWSE_DATA,
    });
  }

  getMovieDetails(id: number) {
    const GET_MOVIE_DETAILS = gql`
      query GetMovieDetails($movieId: Int!) {
        movie(id: $movieId) {
          id
          title
          overview
          posterUrl
          backdropUrll
          runtime
          fsk
          genres
          vote_average
          release_date
        }
      }
    `;
    return this.apollo.query<GetMovieDetailsResponse>({
      query: GET_MOVIE_DETAILS,
      variables: {
        movieId: id,
      },
    });
  }
}
