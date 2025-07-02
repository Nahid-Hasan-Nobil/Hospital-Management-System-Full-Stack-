import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class RegisterDoctorDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Specialty is required' })
  specialty: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
