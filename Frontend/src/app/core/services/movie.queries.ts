import { gql } from 'apollo-angular';

const MOVIE_FRAGMENT = gql`
  fragment MovieFragment on Movie {
    id
    title
    overview
    fsk
    genres
    keywords {
      id
      name
    }
    runtime
    vote_average
    release_date
    imageSet {
      posterUrl
      backdropUrl
      backdropUrl2
      heroBackdropUrlDesktop
      heroBackdropUrlMobile
      logoUrl
    }
  }
`;

export const GET_BROWSE_DATA = gql`
  ${MOVIE_FRAGMENT}
  query GetBrowsePageData {
    heroMovie {
      ...MovieFragment
    }
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

export const GET_MOVIE_DETAILS = gql`
  ${MOVIE_FRAGMENT}
  query GetMovieDetails($movieId: Int!) {
    movie(id: $movieId) {
      ...MovieFragment
    }
  }
`;
