export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  logoUrl?: string;
  keywords?: Keyword[];
  backdropUrl?: string;
  runtime?: number;
  certification?: string;
}

export interface EnrichedMovie extends Movie {
  runtime: number;
  certification?: string;
  keywords: Keyword[];
  logoUrl?: string;
}
