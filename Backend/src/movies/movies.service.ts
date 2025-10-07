import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, firstValueFrom } from 'rxjs';
import { ImageSet, Movie, Keyword } from './entities/movie.entity';
import { URL } from 'url';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);
  private readonly tmdbApiKey: string;
  private readonly tmdbBaseUrl = 'https://api.themoviedb.org/3';
  private readonly imageBaseUrl = 'https://image.tmdb.org/t/p/';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    if (!apiKey) {
      throw new Error('TMDB_API_KEY is not defined in the .env file');
    }
    this.tmdbApiKey = apiKey;
  }

  getPopularMovies(): Promise<Movie[]> {
    return this.fetchAndProcessMovies({ sort_by: 'popularity.desc' });
  }

  getTopRatedMovies(): Promise<Movie[]> {
    return this.fetchAndProcessMovies({
      sort_by: 'vote_average.desc',
      'vote_count.gte': '200',
    });
  }

  getMoviesByGenre(genreId: number): Promise<Movie[]> {
    return this.fetchAndProcessMovies({ with_genres: genreId.toString() });
  }

  getMovieById(id: number): Promise<Movie> {
    this.logger.log(`Fetching details for movie with id: ${id}`);
    return this.getMovieDetails(id);
  }

  private async fetchAndProcessMovies(
    discoveryParams: Record<string, string>,
  ): Promise<Movie[]> {
    try {
      const basicMovies = await this.discoverMovies(discoveryParams, 2);
      this.logger.log(`Found ${basicMovies.length} movie candidates.`);
      const detailedMovies = await this.fetchDetailedMovies(basicMovies);
      const moviesWithLogo = detailedMovies.filter(
        (movie) => movie.imageSet?.logoUrl,
      );
      this.logger.log(
        `Filtered to ${moviesWithLogo.length} movies with a logo.`,
      );
      return moviesWithLogo.slice(0, 30);
    } catch (error) {
      this.logger.error(`Failed during multi-page fetch process`, error.stack);
      throw new Error('Could not process movies request.');
    }
  }

  private async discoverMovies(
    params: Record<string, string>,
    pages: number,
  ): Promise<any[]> {
    const pageRequests = Array.from({ length: pages }, (_, i) => {
      const discoverUrl = this.buildDiscoverUrl(params, i + 1);
      return firstValueFrom(
        this.httpService
          .get(discoverUrl.toString())
          .pipe(map((res) => res.data.results)),
      );
    });
    const pagesResults = await Promise.all(pageRequests);
    return pagesResults.flat();
  }

  private buildDiscoverUrl(params: Record<string, string>, page: number): URL {
    const url = new URL(`${this.tmdbBaseUrl}/discover/movie`);
    url.searchParams.append('api_key', this.tmdbApiKey);
    url.searchParams.append('vote_count.gte', '150');
    url.searchParams.append('page', page.toString());
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value),
    );
    return url;
  }

  private async fetchDetailedMovies(movies: any[]): Promise<Movie[]> {
    return Promise.all(movies.map((movie) => this.getMovieDetails(movie.id)));
  }

  private async getMovieDetails(id: number): Promise<Movie> {
    const rawData = await this.fetchRawMovieDetails(id);
    return this.transformRawDataToMovie(rawData);
  }

  private fetchRawMovieDetails(id: number): Promise<any> {
    const url = new URL(`${this.tmdbBaseUrl}/movie/${id}`);
    url.searchParams.append('api_key', this.tmdbApiKey);
    url.searchParams.append(
      'append_to_response',
      'credits,images,keywords,release_dates',
    );
    url.searchParams.append('include_image_language', 'en,null');
    return firstValueFrom(
      this.httpService.get(url.toString()).pipe(map((res) => res.data)),
    );
  }

  private transformRawDataToMovie(rawData: any): Movie {
    const mainBackdropPath = rawData.backdrop_path;
    const alternativeBackdrop = rawData.images?.backdrops?.find(
      (b: any) => b.file_path !== mainBackdropPath,
    );
    const englishLogo = this.findEnglishLogo(rawData.images);
    const imageSet: ImageSet = {
      posterUrl: this.buildImageUrl(rawData.poster_path, 'w500'),
      backdropUrl: this.buildImageUrl(mainBackdropPath, 'w780'),
      backdropUrl2: this.buildImageUrl(alternativeBackdrop?.file_path, 'w780'),
      heroBackdropUrlDesktop: this.buildImageUrl(mainBackdropPath, 'original'),
      heroBackdropUrlMobile: this.buildImageUrl(mainBackdropPath, 'w1280'),
      logoUrl: this.buildImageUrl(englishLogo?.file_path, 'w500'), // Höhere Auflösung für Logos
    };
    return {
      id: rawData.id,
      title: rawData.title,
      overview: rawData.overview,
      runtime: rawData.runtime,
      genres: rawData.genres.map((g: any) => g.name),
      keywords: rawData.keywords?.keywords || [],
      fsk: this.getGermanCertification(rawData.release_dates),
      vote_average: rawData.vote_average,
      release_date: rawData.release_date,
      imageSet: imageSet,
    };
  }

  async getHeroMovie(): Promise<Movie> {
    const candidates = await this.fetchAndProcessMovies({
      sort_by: 'popularity.desc',
    });
    const heroMovie = candidates.find(
      (movie) => movie.imageSet?.heroBackdropUrlDesktop && movie.overview,
    );
    if (!heroMovie) {
      throw new Error('Could not find a suitable hero movie.');
    }
    this.logger.log(`Selected "${heroMovie.title}" as Hero Movie.`);
    return heroMovie;
  }

  private buildImageUrl(path: string | null, size: string): string | null {
    return path ? `${this.imageBaseUrl}${size}${path}` : null;
  }

  private findEnglishLogo(images: any): any | undefined {
    return images?.logos?.find((logo: any) => logo.iso_639_1 === 'en');
  }

  private getGermanCertification(releaseDates: any): string {
    const deRelease = releaseDates?.results?.find(
      (r: any) => r.iso_3166_1 === 'DE',
    );
    const certification = deRelease?.release_dates.find(
      (d: any) => d.certification !== '',
    )?.certification;
    return certification || 'N/A';
  }
}
