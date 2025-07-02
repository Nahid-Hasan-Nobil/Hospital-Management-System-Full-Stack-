import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';

export class UpdateFeedbackDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
