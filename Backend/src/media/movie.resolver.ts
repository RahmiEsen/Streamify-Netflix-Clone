import { Resolver } from '@nestjs/graphql';
import { Movie } from './entities/movie.entity';

@Resolver(() => Movie)
export class MovieResolver {}
