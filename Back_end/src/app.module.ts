import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AuthModule } from './auth/auth.module';

import { Patient } from './patient/patient.entity';
import { Doctor } from './doctor/doctor.entity';
import { Appointment } from './appointment/appointment.entity';
import { Feedback } from './feedback/feedback.entity'; // Import Feedback entity
import { MailModule } from './mail/mail.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    // Enable configuration and .env support
    ConfigModule.forRoot({
      isGlobal: true, // makes config available globally
    }),

    // Database configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'root'),
        database: configService.get<string>('DB_NAME', 'hospital'),
        entities: [Patient, Doctor, Appointment, Feedback], // Added Feedback here
        synchronize: true, // disable in production
      }),
    }),

    // Application modules
    PatientModule,
    DoctorModule,
    AppointmentModule,
    FeedbackModule, // Removed duplicate import
    AuthModule, MailModule, OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}