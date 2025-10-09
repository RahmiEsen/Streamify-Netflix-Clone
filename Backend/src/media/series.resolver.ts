import { Resolver } from '@nestjs/graphql';
import { Series } from './entities/series.entity';

@Resolver(() => Series)
export class SeriesResolver {}
