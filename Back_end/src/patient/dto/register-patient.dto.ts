import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterPatientDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;


}