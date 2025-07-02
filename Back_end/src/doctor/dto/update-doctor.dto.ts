import { IsOptional, IsString } from 'class-validator';

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
