import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException, // Added for better handling of login errors
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private jwtService: JwtService,
  ) {}

  // Register new patient
  async register(createDto: RegisterPatientDto): Promise<Patient> {
    try {
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(createDto.password, 10);
      const patient = this.patientRepository.create({
        ...createDto,
        password: hashedPassword,
      });
      return await this.patientRepository.save(patient);
    } catch (error) {
      console.error('Registration Error:', error.message);
      throw new InternalServerErrorException('Could not register patient');
    }
  }

  // Patient login with phone number and password
  async login(
    phoneNumber: string,
    password: string,
  ): Promise<{ access_token: string; patient: Partial<Patient> } | null> {
    const patient = await this.patientRepository.findOne({
      where: { phoneNumber },
    });
    if (!patient) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    // Create JWT token with patient ID and phone number
    const payload = { sub: patient.id, phoneNumber: patient.phoneNumber };
    const token = this.jwtService.sign(payload);

    const { password: _, ...patientInfo } = patient;

    return {
      access_token: token,
      patient: patientInfo,
    };
  }

  // Get all patients
  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  // Get patient by phone number
  async findOne(phoneNumber: string): Promise<Patient | null> {
    return this.patientRepository.findOne({ where: { phoneNumber } });
  }

  // Update patient information
  async update(phoneNumber: string, updateDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(phoneNumber);
    if (!patient) {
      throw new NotFoundException(`Patient with phone number ${phoneNumber} not found`);
    }

    try {
      // Update patient data
      Object.assign(patient, updateDto);
      return await this.patientRepository.save(patient);
    } catch (error) {
      console.error('Update Error:', error.message);
      throw new InternalServerErrorException('Could not update patient');
    }
  }

  // Delete a patient by phone number
  async delete(phoneNumber: string): Promise<void> {
    try {
      const result = await this.patientRepository.delete({ phoneNumber });
      if (result.affected === 0) {
        throw new NotFoundException(`Patient with phone number ${phoneNumber} not found`);
      }
    } catch (error) {
      console.error('Delete Error:', error.message);
      throw new InternalServerErrorException('Could not delete patient');
    }
  }
}
