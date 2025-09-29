export interface Keyword {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview?: string;
  posterUrl?: string;
  backdropUrl?: string;
  release_date?: string;
  vote_average?: number;
  runtime?: number;
  fsk?: string;
  genres?: string[];
  keywords?: Keyword[];
}
