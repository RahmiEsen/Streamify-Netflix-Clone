import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Movie } from './entities/movie.entity';
export declare class MoviesService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly tmdbApiKey;
    private readonly tmdbBaseUrl;
    private readonly imageBaseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    getPopularMovies(): Promise<Movie[]>;
    getTopRatedMovies(): Promise<Movie[]>;
    getMoviesByGenre(genreId: number): Promise<Movie[]>;
    getMovieById(id: number): Promise<Movie>;
    private fetchAndProcessMovies;
    private discoverMovies;
    private buildDiscoverUrl;
    private fetchDetailedMovies;
    private getMovieDetails;
    private fetchRawMovieDetails;
    private transformRawDataToMovie;
    getHeroMovie(): Promise<Movie>;
    private buildImageUrl;
    private findEnglishLogo;
    private getGermanCertification;
}
