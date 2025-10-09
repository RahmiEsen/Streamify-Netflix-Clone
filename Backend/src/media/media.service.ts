import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, firstValueFrom } from 'rxjs';
import { Movie } from './entities/movie.entity';
import { Series } from './entities/series.entity';
import { URL } from 'url';

export type MediaType = 'movie' | 'tv';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
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

  async getPopularMedia(): Promise<(Movie | Series)[]> {
    const movies = this.fetchAndProcessMedia('movie', {
      sort_by: 'popularity.desc',
    });
    const series = this.fetchAndProcessMedia('tv', {
      sort_by: 'popularity.desc',
    });
    return this.combineAndSortResults(await movies, await series);
  }

  async getTopRatedMedia(): Promise<(Movie | Series)[]> {
    const movies = this.fetchAndProcessMedia('movie', {
      sort_by: 'vote_average.desc',
      'vote_count.gte': '200',
    });
    const series = this.fetchAndProcessMedia('tv', {
      sort_by: 'vote_average.desc',
      'vote_count.gte': '200',
    });
    return this.combineAndSortResults(await movies, await series);
  }

  async getMediaByGenre(genreId: number): Promise<(Movie | Series)[]> {
    const movies = this.fetchAndProcessMedia('movie', {
      with_genres: genreId.toString(),
    });
    const series = this.fetchAndProcessMedia('tv', {
      with_genres: genreId.toString(),
    });
    return this.combineAndSortResults(await movies, await series);
  }

  async getMediaById(
    id: number,
    mediaType: MediaType,
  ): Promise<Movie | Series> {
    this.logger.log(`Fetching details for ${mediaType} with id: ${id}`);
    return this.getMediaDetails(id, mediaType);
  }

  async getHeroMedia(): Promise<Movie | Series> {
    const candidates = await this.fetchAndProcessMedia('movie', {
      sort_by: 'popularity.desc',
    });
    const heroMedia = candidates.find(
      (media) =>
        (media as Movie).imageSet?.heroBackdropUrlDesktop && media.overview,
    );
    if (!heroMedia) {
      throw new Error('Could not find a suitable hero media.');
    }
    this.logger.log(`Selected "${heroMedia.title}" as Hero Media.`);
    return heroMedia;
  }

  private async fetchAndProcessMedia(
    mediaType: MediaType,
    discoveryParams: Record<string, string>,
  ): Promise<(Movie | Series)[]> {
    try {
      const basicMedia = await this.discoverMedia(
        mediaType,
        discoveryParams,
        1,
      );
      this.logger.log(`Found ${basicMedia.length} ${mediaType} candidates.`);
      const detailedMedia = await this.fetchDetailedMedia(
        mediaType,
        basicMedia,
      );
      const mediaWithLogo = detailedMedia.filter(
        (media) => (media as Movie).imageSet?.logoUrl,
      );
      this.logger.log(
        `Filtered to ${mediaWithLogo.length} ${mediaType}s with a logo.`,
      );
      return mediaWithLogo;
    } catch (error) {
      this.logger.error(
        `Failed during fetch process for ${mediaType}`,
        error.stack,
      );
      throw new Error(`Could not process ${mediaType} request.`);
    }
  }

  private async discoverMedia(
    mediaType: MediaType,
    params: Record<string, string>,
    pages: number,
  ): Promise<any[]> {
    const pageRequests = Array.from({ length: pages }, (_, i) => {
      const discoverUrl = this.buildDiscoverUrl(mediaType, params, i + 1);
      return firstValueFrom(
        this.httpService
          .get(discoverUrl.toString())
          .pipe(map((res) => res.data.results)),
      );
    });
    const pagesResults = await Promise.all(pageRequests);
    return pagesResults.flat();
  }

  private buildDiscoverUrl(
    mediaType: MediaType,
    params: Record<string, string>,
    page: number,
  ): URL {
    const url = new URL(`${this.tmdbBaseUrl}/discover/${mediaType}`);
    url.searchParams.append('api_key', this.tmdbApiKey);
    url.searchParams.append('vote_count.gte', '150');
    url.searchParams.append('page', page.toString());
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value),
    );
    return url;
  }

  private async fetchDetailedMedia(
    mediaType: MediaType,
    mediaItems: any[],
  ): Promise<(Movie | Series)[]> {
    return Promise.all(
      mediaItems.map((item) => this.getMediaDetails(item.id, mediaType)),
    );
  }

  private async getMediaDetails(
    id: number,
    mediaType: MediaType,
  ): Promise<Movie | Series> {
    const rawData = await this.fetchRawMediaDetails(id, mediaType);
    return this.transformRawDataToMedia(rawData, mediaType);
  }

  private fetchRawMediaDetails(id: number, mediaType: MediaType): Promise<any> {
    const url = new URL(`${this.tmdbBaseUrl}/${mediaType}/${id}`);
    url.searchParams.append('api_key', this.tmdbApiKey);
    const appendToResponse =
      mediaType === 'movie'
        ? 'credits,images,keywords,release_dates'
        : 'credits,images,keywords,content_ratings';
    url.searchParams.append('append_to_response', appendToResponse);
    url.searchParams.append('include_image_language', 'en,null');
    return firstValueFrom(
      this.httpService.get(url.toString()).pipe(map((res) => res.data)),
    );
  }

  private combineAndSortResults(
    movies: (Movie | Series)[],
    series: (Movie | Series)[],
  ): (Movie | Series)[] {
    const combined = [...movies, ...series];
    combined.sort((a, b) => b.vote_average - a.vote_average);
    return combined.slice(0, 30);
  }

  private transformRawDataToMedia(
    rawData: any,
    mediaType: MediaType,
  ): Movie | Series {
    const imageSet = this.createImageSet(rawData);
    const isMovie = mediaType === 'movie';

    const commonProperties = {
      id: rawData.id,
      title: isMovie ? rawData.title : rawData.name,
      release_date: isMovie ? rawData.release_date : rawData.first_air_date,
      fsk: isMovie
        ? this.getGermanCertificationForMovie(rawData.release_dates)
        : this.getGermanCertificationForSeries(rawData.content_ratings),
      overview: rawData.overview,
      vote_average: rawData.vote_average,
      imageSet: imageSet,

      // --- KORRIGIERTE, SICHERE ZEILEN ---
      // Fügt "?." hinzu, um Abstürze zu vermeiden, wenn .genres nicht existiert.
      // Fügt "?? []" hinzu, um sicherzustellen, dass es immer ein Array ist.
      genres: rawData.genres?.map((g: any) => g.name) ?? [],

      // Prüft jetzt auf beide möglichen Strukturen (.keywords und .results)
      keywords: rawData.keywords?.keywords || rawData.keywords?.results || [],
    };

    if (isMovie) {
      return Object.assign(new Movie(), {
        ...commonProperties,
        duration: rawData.runtime,
      });
    } else {
      return Object.assign(new Series(), {
        ...commonProperties,
        numberOfSeasons: rawData.number_of_seasons,
      });
    }
  }

  private createImageSet(rawData: any): any {
    const mainBackdropPath = rawData.backdrop_path;
    const alternativeBackdrop = rawData.images?.backdrops?.find(
      (b: any) => b.file_path !== mainBackdropPath,
    );
    const englishLogo = this.findEnglishLogo(rawData.images);
    return {
      posterUrl: this.buildImageUrl(rawData.poster_path, 'w500'),
      backdropUrl: this.buildImageUrl(mainBackdropPath, 'w780'),
      backdropUrl2: this.buildImageUrl(alternativeBackdrop?.file_path, 'w780'),
      heroBackdropUrlDesktop: this.buildImageUrl(mainBackdropPath, 'original'),
      heroBackdropUrlMobile: this.buildImageUrl(mainBackdropPath, 'w1280'),
      logoUrl: this.buildImageUrl(englishLogo?.file_path, 'w500'),
    };
  }

  private buildImageUrl(path: string | null, size: string): string | null {
    return path ? `${this.imageBaseUrl}${size}${path}` : null;
  }

  private findEnglishLogo(images: any): any | undefined {
    return images?.logos?.find((logo: any) => logo.iso_639_1 === 'en');
  }

  private getGermanCertificationForMovie(releaseDates: any): string {
    const deRelease = releaseDates?.results?.find(
      (r: any) => r.iso_3166_1 === 'DE',
    );
    const certification = deRelease?.release_dates.find(
      (d: any) => d.certification !== '',
    )?.certification;
    return certification || 'N/A';
  }

  private getGermanCertificationForSeries(contentRatings: any): string {
    const deRating = contentRatings?.results?.find(
      (r: any) => r.iso_3166_1 === 'DE',
    );
    return deRating?.rating || 'N/A';
  }
}
