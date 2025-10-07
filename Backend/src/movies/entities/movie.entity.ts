import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

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

@ObjectType({ description: 'Represents a movie from TMDB' })
export class Movie {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => ImageSet, { nullable: true })
  imageSet: ImageSet | null;

  @Field(() => String, { nullable: true })
  overview: string;

  @Field(() => Float)
  vote_average: number;

  @Field()
  release_date: string;

  @Field(() => Int, { nullable: true })
  runtime: number;

  @Field(() => [String], { nullable: true })
  genres: string[];

  @Field(() => [Keyword], { nullable: true })
  keywords: Keyword[];

  @Field(() => String, { nullable: true })
  fsk: string;
}
