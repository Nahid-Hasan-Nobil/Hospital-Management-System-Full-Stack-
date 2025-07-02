import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { Feedback } from 'src/feedback/feedback.entity';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import { OtpModule } from '../otp/otp.module'; // ✅ Import OTP Module

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Feedback]),
    MailModule,
    AuthModule,   // Provides JwtService
    OtpModule,    // ✅ Provides OtpService
  ],
  providers: [DoctorService],
  controllers: [DoctorController],
})
export class DoctorModule {}
