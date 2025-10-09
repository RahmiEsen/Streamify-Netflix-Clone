import { ObjectType, Field, Int, Float, InterfaceType } from '@nestjs/graphql';
import { Entity, PrimaryColumn, Column, TableInheritance } from 'typeorm';
import { Movie } from './movie.entity';
import { Series } from './series.entity';

@ObjectType()
export class ImageSet {
  @Field(() => String, { nullable: true })
  posterUrl: string | null;

  @Field(() => String, { nullable: true })
  backdropUrl: string | null;

  @Field(() => String, { nullable: true })
  backdropUrl2: string | null;

  @Field(() => String, { nullable: true })
  heroBackdropUrlDesktop: string | null;

  @Field(() => String, { nullable: true })
  heroBackdropUrlMobile: string | null;

  @Field(() => String, { nullable: true })
  logoUrl: string | null;
}

@ObjectType()
export class Keyword {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}

@InterfaceType({
  // Die Funktion bleibt, aber sie gibt jetzt einen String zurück
  resolveType(value: { duration?: number; numberOfSeasons?: number }) {
    if ('duration' in value) {
      return 'Movie'; // Gibt den Namen als String zurück
    }
    if ('numberOfSeasons' in value) {
      return 'Series'; // Gibt den Namen als String zurück
    }
    return null;
  },
})
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Media {
  @Field(() => Int)
  @PrimaryColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field(() => ImageSet, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  imageSet: ImageSet | null;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  overview: string;

  @Field(() => Float)
  @Column({ type: 'float' })
  vote_average: number;

  @Field()
  @Column()
  release_date: string;

  @Field(() => [String])
  @Column('simple-array')
  genres: string[];

  @Field(() => [Keyword], { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  keywords: Keyword[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  fsk: string;

  @Column()
  type: string;
}
