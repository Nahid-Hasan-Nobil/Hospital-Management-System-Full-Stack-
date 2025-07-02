// ✅ Updated: create-appointment.dto.ts
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
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

  @IsDateString()
  appointmentDate: Date;
}
