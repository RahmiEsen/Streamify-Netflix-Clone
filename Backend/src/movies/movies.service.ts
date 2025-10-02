import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { map, firstValueFrom } from "rxjs";
import { Movie } from "./entities/movie.entity";
import { URL } from "url";

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);
  private readonly tmdbApiKey: string;
  private readonly tmdbBaseUrl = "https://api.themoviedb.org/3";

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    const apiKey = this.configService.get<string>("TMDB_API_KEY");
    if (!apiKey) {
      throw new Error("TMDB_API_KEY is not defined in the .env file");
    }
    this.tmdbApiKey = apiKey;
  }

  getPopularMovies(): Promise<Movie[]> {
    return this.fetchAndProcessMovies({ sort_by: "popularity.desc" });
  }

  getTopRatedMovies(): Promise<Movie[]> {
    return this.fetchAndProcessMovies({
      sort_by: "vote_average.desc",
      "vote_count.gte": "200",
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
    discoveryParams: Record<string, string>
  ): Promise<Movie[]> {
    const pagesToFetch = 2;
    const pageRequests: Promise<any[]>[] = [];
    for (let i = 1; i <= pagesToFetch; i++) {
      const discoverUrl = new URL(`${this.tmdbBaseUrl}/discover/movie`);
      discoverUrl.searchParams.append("api_key", this.tmdbApiKey);
      discoverUrl.searchParams.append("vote_count.gte", "150");
      Object.entries(discoveryParams).forEach(([key, value]) => {
        discoverUrl.searchParams.append(key, value);
      });
      discoverUrl.searchParams.append("page", i.toString());
      const request = firstValueFrom(
        this.httpService
          .get(discoverUrl.toString())
          .pipe(map((res) => res.data.results))
      );
      pageRequests.push(request);
    }
    this.logger.log(`Phase 1: Discovering movies from ${pagesToFetch} pages.`);
    try {
      const pagesResults = await Promise.all(pageRequests);
      const basicMovies = pagesResults.flat();
      this.logger.log(`Phase 1: Found ${basicMovies.length} movie candidates.`);
      const detailedMovies = await Promise.all(
        basicMovies.map((movie) => this.getMovieDetails(movie.id))
      );
      const moviesWithLogo = detailedMovies.filter((movie) => movie.logoUrl);
      this.logger.log(
        `Phase 3: Filtered down to ${moviesWithLogo.length} movies with a logo.`
      );
      return moviesWithLogo.slice(0, 30);
    } catch (error) {
      this.logger.error(`Failed during multi-page fetch process`, error.stack);
      throw new Error("Could not process movies request.");
    }
  }

  private async getMovieDetails(id: number): Promise<Movie> {
    const detailsUrl = new URL(`${this.tmdbBaseUrl}/movie/${id}`);
    detailsUrl.searchParams.append("api_key", this.tmdbApiKey);
    detailsUrl.searchParams.append(
      "append_to_response",
      "credits,images,keywords,release_dates"
    );
    detailsUrl.searchParams.append("include_image_language", "en,null");
    const rawData = await firstValueFrom(
      this.httpService.get(detailsUrl.toString()).pipe(map((res) => res.data))
    );
    const englishLogo = rawData.images?.logos?.find(
      (logo) => logo.iso_639_1 === "en"
    );
    const fsk =
      rawData.release_dates.results
        .find((r) => r.iso_3166_1 === "DE")
        ?.release_dates.find((d) => d.certification !== "")?.certification ||
      "N/A";
    const backdropUrls =
      rawData.images?.backdrops?.map(
        (backdrop: any) =>
          `https://image.tmdb.org/t/p/original${backdrop.file_path}`
      ) || [];
    const movie: Movie = {
      id: rawData.id,
      title: rawData.title,
      overview: rawData.overview,
      posterUrl: rawData.poster_path
        ? `https://image.tmdb.org/t/p/w500${rawData.poster_path}`
        : null,
      backdropUrl: backdropUrls.length > 0 ? backdropUrls[0] : null,
      backdrops: backdropUrls,
      runtime: rawData.runtime,
      genres: rawData.genres.map((genre) => genre.name),
      fsk: fsk,
      vote_average: rawData.vote_average,
      release_date: rawData.release_date,
      logoUrl: englishLogo
        ? `https://image.tmdb.org/t/p/w500${englishLogo.file_path}`
        : null,
    };
    return movie;
  }
}
