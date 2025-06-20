import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  restaurantId: number;

  @IsString()
  content: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
