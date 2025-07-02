import { IsNotEmpty, IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsString()
  @IsNotEmpty()
  patientPhoneNumber: string;

  @IsString()
  @IsNotEmpty()
  doctorName: string;

  @IsString()
  @IsNotEmpty()
  doctorEmail: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
