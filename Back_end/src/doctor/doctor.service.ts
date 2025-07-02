import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '../otp/otp.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  // ✅ Register a new doctor
  async register(createDto: RegisterDoctorDto): Promise<Doctor> {
    try {
      const hashedPassword = await bcrypt.hash(createDto.password, 10);

      const doctor = this.doctorRepository.create({
        ...createDto,
        password: hashedPassword,
      });

      const savedDoctor = await this.doctorRepository.save(doctor);

      await this.mailService.sendRegistrationEmail(
        savedDoctor.email,
        savedDoctor.name,
      );

      return savedDoctor;
    } catch (error) {
      console.error('Registration Error:', error.message);
      throw new InternalServerErrorException('Could not register doctor');
    }
  }

  // ✅ Login doctor and generate JWT token
  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; doctor: Partial<Doctor> }> {
    const doctor = await this.doctorRepository.findOne({ where: { email } });
    if (!doctor) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    const payload = { sub: doctor.id, email: doctor.email };
    const access_token = this.jwtService.sign(payload);
    const { password: _, ...doctorInfo } = doctor;

    return { access_token, doctor: doctorInfo };
  }

  // ✅ Send OTP to email for password reset
  async sendOtp(email: string) {
    const doctor = await this.doctorRepository.findOne({ where: { email } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    return this.otpService.sendOtp(email);
  }

  // ✅ Verify OTP only
  verifyOtp(email: string, otp: string): boolean {
    return this.otpService.verifyOtp(email, otp);
  }

  // ✅ Reset password using OTP
  async resetPassword(email: string, otp: string, newPassword: string) {
    const doctor = await this.doctorRepository.findOne({ where: { email } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const isValid = this.otpService.verifyOtp(email, otp);
    if (!isValid) throw new BadRequestException('Invalid OTP');

    const hashed = await bcrypt.hash(newPassword, 10);
    doctor.password = hashed;
    await this.doctorRepository.save(doctor);

    this.otpService.clearOtp(email);

    return { message: 'Password has been reset successfully' };
  }

  // ✅ Get all doctors
  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find();
  }

  // ✅ Get doctors by specialty
  async findBySpecialty(specialty: string): Promise<Doctor[]> {
    return this.doctorRepository.find({
      where: { specialty },
    });
  }

  // ✅ Update doctor details
  async update(id: number, updateDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    if (!doctor)
      throw new NotFoundException(`Doctor with ID ${id} not found`);

    try {
      if (updateDto.password) {
        updateDto.password = await bcrypt.hash(updateDto.password, 10);
      }

      Object.assign(doctor, updateDto);
      return await this.doctorRepository.save(doctor);
    } catch (error) {
      console.error('Update Error:', error.message);
      throw new InternalServerErrorException('Could not update doctor');
    }
  }

  // ✅ Delete a doctor by ID
  async delete(id: number): Promise<void> {
    try {
      const result = await this.doctorRepository.delete(id);
      if (result.affected === 0)
        throw new NotFoundException(`Doctor with ID ${id} not found`);
    } catch (error) {
      console.error('Delete Error:', error.message);
      throw new InternalServerErrorException('Could not delete doctor');
    }
  }

  // ✅ Get a doctor by email
  async findOneByEmail(email: string): Promise<Doctor | null> {
    return this.doctorRepository.findOne({ where: { email } });
  }
}
