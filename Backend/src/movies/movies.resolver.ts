import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';

@Resolver(() => Movie)
export class MoviesResolver {
  constructor(private readonly moviesService: MoviesService) {}

  @Query(() => [Movie], { name: 'popularMovies' })
  getPopularMovies(): Promise<Movie[]> {
    return this.moviesService.getPopularMovies();
  }

  @Query(() => [Movie], { name: 'topRatedMovies' })
  getTopRatedMovies(): Promise<Movie[]> {
    return this.moviesService.getTopRatedMovies();
  }

  @Query(() => [Movie], { name: 'moviesByGenre' })
  getMoviesByGenre(
    @Args('genreId', { type: () => Int }) genreId: number,
  ): Promise<Movie[]> {
    return this.moviesService.getMoviesByGenre(genreId);
  }

  @Query(() => Movie, { name: 'movie' })
  getMovieById(@Args('id', { type: () => Int }) id: number): Promise<Movie> {
    return this.moviesService.getMovieById(id);
  }

  @Query(() => Movie, { name: 'heroMovie' })
  getHeroMovie(): Promise<Movie> {
    return this.moviesService.getHeroMovie();
  }
}
