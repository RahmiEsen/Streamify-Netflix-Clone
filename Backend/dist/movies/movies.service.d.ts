import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Movie } from "./entities/movie.entity";
export declare class MoviesService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly tmdbApiKey;
    private readonly tmdbBaseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    getPopularMovies(): Promise<Movie[]>;
    getTopRatedMovies(): Promise<Movie[]>;
    getMoviesByGenre(genreId: number): Promise<Movie[]>;
    getMovieById(id: number): Promise<Movie>;
    private fetchAndProcessMovies;
    private getMovieDetails;
}
