import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule
import { Feedback } from 'src/feedback/feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, Feedback]),
    AuthModule, // Use shared AuthModule
  ],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
