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

export interface Movie {
  id: number;
  title: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  runtime?: number;
  fsk?: string;
  genres?: string[];
  keywords?: Keyword[];
  imageSet?: ImageSet | null;
}
