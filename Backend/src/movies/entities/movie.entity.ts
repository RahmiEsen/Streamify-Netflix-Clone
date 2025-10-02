import { ObjectType, Field, Int, Float } from "@nestjs/graphql";

@ObjectType({ description: "Represents a movie from TMDB" })
export class Movie {
  @Field(() => Int, { description: "The unique identifier of the movie" })
  id: number;

  @Field({ description: "The title of the movie" })
  title: string;

  @Field(() => String, {
    nullable: true,
    description: "The summary of the movie",
  })
  overview: string;

  @Field(() => String, {
    nullable: true,
    description: "The full URL to the poster image (w500)",
  })
  posterUrl: string | null;

  @Field(() => String, {
    nullable: true,
    description: "The full URL to the backdrop image (original)",
  })
  backdropUrl: string | null;

  @Field(() => [String], { nullable: "itemsAndList" })
  backdrops: string[];

  @Field(() => String, {
    nullable: true,
    description: "The full URL to the movie logo (German)",
  })
  logoUrl: string | null;

  @Field(() => Float, { description: "The average vote for the movie" })
  vote_average: number;

  @Field({ description: 'The release date of the movie, e.g., "2023-10-25"' })
  release_date: string;

  @Field(() => Int, {
    nullable: true,
    description: "The runtime of the movie in minutes",
  })
  runtime: number;

  @Field(() => [String], {
    nullable: true,
    description: "A list of genre names for the movie",
  })
  genres: string[];

  @Field(() => String, {
    nullable: true,
    description: "The German MPAA rating (FSK)",
  })
  fsk: string;
}
