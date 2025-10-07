import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
export declare class MoviesResolver {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    getPopularMovies(): Promise<Movie[]>;
    getTopRatedMovies(): Promise<Movie[]>;
    getMoviesByGenre(genreId: number): Promise<Movie[]>;
    getMovieById(id: number): Promise<Movie>;
    getHeroMovie(): Promise<Movie>;
}
