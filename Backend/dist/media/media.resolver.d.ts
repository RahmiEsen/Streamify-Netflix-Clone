import { MediaService } from './media.service';
import type { MediaType } from './media.service';
import { Movie } from './entities/movie.entity';
import { Series } from './entities/series.entity';
export declare class MediaResolver {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    getPopularMedia(): Promise<(Movie | Series)[]>;
    getTopRatedMedia(): Promise<(Movie | Series)[]>;
    getMediaByGenre(genreId: number): Promise<(Movie | Series)[]>;
    getMediaById(id: number, mediaType: MediaType): Promise<Movie | Series>;
    getHeroMedia(): Promise<Movie | Series>;
}
