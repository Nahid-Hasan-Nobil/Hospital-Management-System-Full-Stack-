import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Patient } from '../patient/patient.entity';
import { Doctor } from '../doctor/doctor.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,

    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  // ✅ Create appointment
  async create(createDto: CreateAppointmentDto): Promise<Appointment> {
    const patient = await this.patientRepository.findOne({
      where: { phoneNumber: createDto.patientPhoneNumber, name: createDto.patientName },
    });
    if (!patient) throw new NotFoundException(`Patient not found with phone number ${createDto.patientPhoneNumber}`);

    const doctor = await this.doctorRepository.findOne({
      where: { email: createDto.doctorEmail, name: createDto.doctorName },
    });
    if (!doctor) throw new NotFoundException(`Doctor not found with email ${createDto.doctorEmail}`);

    const appointment = this.appointmentRepository.create({ ...createDto, patient, doctor });

    try {
      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      console.error('Appointment Creation Error:', error);
      throw new InternalServerErrorException('Could not create appointment');
    }
  }

  // ✅ Get appointment by ID
  async findById(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
    if (!appointment) throw new NotFoundException(`Appointment with ID ${id} not found`);
    return appointment;
  }

  // ✅ Update appointment by ID
  async updateById(id: number, updateDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findById(id);
    Object.assign(appointment, updateDto);
    try {
      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      console.error('Update Appointment Error:', error);
      throw new InternalServerErrorException('Could not update appointment');
    }
  }

  // ✅ Delete appointment by ID
  async deleteById(id: number): Promise<string> {
    const appointment = await this.findById(id);
    try {
      await this.appointmentRepository.remove(appointment);
      return `Appointment with ID ${id} deleted successfully`;
    } catch (error) {
      console.error('Delete Appointment Error:', error);
      throw new InternalServerErrorException('Could not delete appointment');
    }
  }

  // ✅ Get all appointments by patient phone number
  async findByPhone(phoneNumber: string): Promise<Appointment[]> {
    const patient = await this.patientRepository.findOne({ where: { phoneNumber } });
    if (!patient) throw new NotFoundException(`Patient not found with phone number ${phoneNumber}`);

    const appointments = await this.appointmentRepository.find({
      where: { patient: { id: patient.id } },
      relations: ['doctor'],
    });

    if (!appointments.length) throw new NotFoundException(`No appointments found for patient with phone number ${phoneNumber}`);
    return appointments;
  }

  // ✅ Get all appointments by doctor email
  async findByDoctorEmail(doctorEmail: string): Promise<Appointment[]> {
  const doctor = await this.doctorRepository.findOne({
    where: { email: doctorEmail },
  });

  if (!doctor) throw new NotFoundException('Doctor not found');

  const appointments = await this.appointmentRepository.find({
    where: { doctor: { id: doctor.id } },
    relations: ['patient'],
  });

  if (!appointments.length) {
    throw new NotFoundException('No appointments found for this doctor');
  }

  // Log the appointments before returning them
  console.log('Appointments for doctor:', appointments);

  return appointments;
}
}
