import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Patient } from '../patient/patient.entity';
import { Doctor } from '../doctor/doctor.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  // Patient relationship with eager loading removed
  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  // Doctor relationship with eager loading removed
  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column()
  patientName: string;

  @Column()
  patientPhoneNumber: string;

  @Column()
  doctorName: string;

  @Column()
  doctorEmail: string;

  @Column()
  appointmentDate: Date; // The actual appointment date & time

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
