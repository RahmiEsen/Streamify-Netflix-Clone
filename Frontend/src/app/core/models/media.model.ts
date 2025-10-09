export interface Keyword {
  id: number;
  name: string;
}

export interface ImageSet {
  posterUrl?: string | null;
  backdropUrl?: string | null;
  backdropUrl2?: string | null;
  heroBackdropUrlDesktop?: string | null;
  heroBackdropUrlMobile?: string | null;
  logoUrl?: string | null;
}

export interface Media {
  id: number;
  title: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  fsk?: string;
  genres?: string[];
  keywords?: Keyword[];
  imageSet?: ImageSet | null;
  __typename: 'Movie' | 'Series';
}

export interface Movie extends Media {
  __typename: 'Movie';
  duration: number;
}

export interface Series extends Media {
  __typename: 'Series';
  numberOfSeasons: number;
}
