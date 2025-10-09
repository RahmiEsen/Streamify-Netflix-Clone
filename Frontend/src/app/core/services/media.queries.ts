import { gql } from 'apollo-angular';

export const MEDIA_FRAGMENT = gql`
  fragment MediaFragment on Media {
    id
    title
    overview
    fsk
    genres
    vote_average
    release_date
    keywords {
      id
      name
    }
    imageSet {
      posterUrl
      backdropUrl
      backdropUrl2
      heroBackdropUrlDesktop
      heroBackdropUrlMobile
      logoUrl
    }
    __typename
    ... on Movie {
      duration
    }
    ... on Series {
      numberOfSeasons
    }
  }
`;

const EXPLICIT_MEDIA_FIELDS = `
  id
  title
  overview
  fsk
  genres
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
  __typename
  ... on Movie {
    duration
  }
  ... on Series {
    numberOfSeasons
  }
`;

export const GET_POPULAR_MEDIA = gql`
  query GetPopularMedia {
    popularMedia {
      ${EXPLICIT_MEDIA_FIELDS}
    }
  }
`;

export const GET_TOP_RATED_MEDIA = gql`
  query GetTopRatedMedia {
    topRatedMedia {
      ${EXPLICIT_MEDIA_FIELDS}
    }
  }
`;

export const GET_MEDIA_BY_GENRE = gql`
  query GetMediaByGenre($genreId: Int!) {
    mediaByGenre(genreId: $genreId) {
      ${EXPLICIT_MEDIA_FIELDS}
    }
  }
`;

export const GET_HERO_MEDIA = gql`
  query GetHeroMedia {
    heroMedia {
      ${EXPLICIT_MEDIA_FIELDS}
    }
  }
`;

export const GET_MEDIA_BY_ID = gql`
  query GetMediaById($id: Int!, $mediaType: String!) {
    mediaById(id: $id, mediaType: $mediaType) {
      ${EXPLICIT_MEDIA_FIELDS}
    }
  }
`;
