import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Patient } from '../patient/patient.entity';
import { Doctor } from '../doctor/doctor.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,

    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  // ✅ Create feedback by patient name & phone + doctor name & email
  async create(createDto: CreateFeedbackDto): Promise<Feedback> {
    const patient = await this.patientRepository.findOne({
      where: {
        name: createDto.patientName,
        phoneNumber: createDto.patientPhoneNumber,
      },
    });
    if (!patient) throw new NotFoundException('Patient not found');

    const doctor = await this.doctorRepository.findOne({
      where: {
        name: createDto.doctorName,
        email: createDto.doctorEmail,
      },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const feedback = this.feedbackRepository.create({
      patient,
      doctor,
      rating: createDto.rating,
      comment: createDto.comment,
    });

    return this.feedbackRepository.save(feedback);
  }

  // ✅ Get all feedbacks for a doctor
  async findByDoctor(doctorId: number): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ['patient'],
    });
  }

  // ✅ Get all feedbacks by patient phone number
  async findByPatientPhone(phoneNumber: string): Promise<Feedback[]> {
    const patient = await this.patientRepository.findOne({ where: { phoneNumber } });
    if (!patient) throw new NotFoundException('Patient not found');

    return this.feedbackRepository.find({
      where: { patient: { id: patient.id } },
      relations: ['doctor'],
    });
  }

  // ✅ Update feedback by patient phone number
  async updateByPhone(
    id: number,
    updateDto: UpdateFeedbackDto,
    phoneNumber: string,
  ): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!feedback) throw new NotFoundException('Feedback not found');
    if (feedback.patient.phoneNumber !== phoneNumber)
      throw new ForbiddenException('Access denied');

    Object.assign(feedback, updateDto);
    return this.feedbackRepository.save(feedback);
  }

  // ✅ Delete feedback by patient phone number
  async removeByPhone(id: number, phoneNumber: string): Promise<void> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!feedback) throw new NotFoundException('Feedback not found');
    if (feedback.patient.phoneNumber !== phoneNumber)
      throw new ForbiddenException('Access denied');

    await this.feedbackRepository.remove(feedback);
  }
}
