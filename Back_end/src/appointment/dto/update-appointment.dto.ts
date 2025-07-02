import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsNumber()
  patientId?: number;

  @IsOptional()
  @IsNumber()
  doctorId?: number;

  @IsOptional()
  @IsString()
  patientName?: string;

  @IsOptional()
  @IsString()
  patientPhoneNumber?: string;

  @IsOptional()
  @IsString()
  doctorName?: string;

  @IsOptional()
  @IsString()
  doctorEmail?: string;

  @IsOptional()
  @IsDateString()
  appointmentDate?: Date;
}
