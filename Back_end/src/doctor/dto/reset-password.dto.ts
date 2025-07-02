import { IsEmail, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6) // OTP length of 6
  otp: string;

  @IsString()
  @Length(6, 20) // New password should be between 6 and 20 characters
  newPassword: string;
}