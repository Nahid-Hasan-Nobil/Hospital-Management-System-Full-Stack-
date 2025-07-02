import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Patient } from '../patient/patient.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Appointment } from './appointment.entity';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule to provide JWT functionality

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Patient, Doctor]), // Register entities
    PassportModule, // Passport for JWT handling
    AuthModule, // Import AuthModule to provide JwtStrategy and JwtModule
  ],
  providers: [AppointmentService], // Service handling business logic
  controllers: [AppointmentController], // Controller handling HTTP requests
  exports: [AppointmentService], // Export service if needed by other modules
})
export class AppointmentModule {}
