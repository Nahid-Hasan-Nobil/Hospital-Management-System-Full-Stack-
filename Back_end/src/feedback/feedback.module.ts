import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedback.entity';
import { Patient } from '../patient/patient.entity';
import { Doctor } from '../doctor/doctor.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback, Patient, Doctor]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // ✅ Required for @UseGuards(AuthGuard('jwt'))
  ],
  providers: [FeedbackService],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
