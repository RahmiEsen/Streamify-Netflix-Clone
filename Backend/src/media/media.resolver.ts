import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { MediaService } from './media.service';
import type { MediaType } from './media.service';
import { Media } from './entities/media.entity';
import { Movie } from './entities/movie.entity';
import { Series } from './entities/series.entity';

@Resolver(() => Media)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  /* __resolveType(value: Movie | Series): string {
    if ('duration' in value) {
      return 'Movie';
    }
    if ('numberOfSeasons' in value) {
      return 'Series';
    }
    throw new Error(
      `Could not resolve type for media object: ${(value as Media).title}`,
    );
  } */

  @Query(() => [Media], { name: 'popularMedia' })
  getPopularMedia(): Promise<(Movie | Series)[]> {
    return this.mediaService.getPopularMedia();
  }

  @Query(() => [Media], { name: 'topRatedMedia' })
  getTopRatedMedia(): Promise<(Movie | Series)[]> {
    return this.mediaService.getTopRatedMedia();
  }

  @Query(() => [Media], { name: 'mediaByGenre' })
  getMediaByGenre(
    @Args('genreId', { type: () => Int }) genreId: number,
  ): Promise<(Movie | Series)[]> {
    return this.mediaService.getMediaByGenre(genreId);
  }

  @Query(() => Media, { name: 'mediaById', nullable: true })
  getMediaById(
    @Args('id', { type: () => Int }) id: number,
    @Args('mediaType', { type: () => String }) mediaType: MediaType,
  ): Promise<Movie | Series> {
    return this.mediaService.getMediaById(id, mediaType);
  }

  @Query(() => Media, { name: 'heroMedia' })
  getHeroMedia(): Promise<Movie | Series> {
    return this.mediaService.getHeroMedia();
  }
}
