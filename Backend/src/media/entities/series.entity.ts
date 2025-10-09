import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ChildEntity, Column } from 'typeorm';
import { Media } from './media.entity';

@ObjectType({ implements: () => [Media] })
@ChildEntity('series')
export class Series extends Media {
  @Field(() => Int, { description: 'The total number of seasons.' })
  @Column()
  numberOfSeasons: number;
}
