import { IsNotEmpty, IsString } from 'class-validator';

export class LoginPatientDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
