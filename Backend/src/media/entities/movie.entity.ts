import { ObjectType, Field, Float } from '@nestjs/graphql';
import { ChildEntity, Column } from 'typeorm';
import { Media } from './media.entity';

@ObjectType({ implements: () => [Media] })
@ChildEntity('movie')
export class Movie extends Media {
  @Field(() => Float, { description: 'The runtime of the movie in minutes.' })
  @Column({ type: 'float' })
  duration: number;
}
