import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Media } from './entities/media.entity';
import { Movie } from './entities/movie.entity';
import { Series } from './entities/series.entity';
import { MediaResolver } from './media.resolver';
import { MediaService } from './media.service';
import { MovieResolver } from './movie.resolver';
import { SeriesResolver } from './series.resolver';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Media, Movie, Series])],
  providers: [MediaResolver, MediaService, MovieResolver, SeriesResolver],
})
export class MediaModule {}
