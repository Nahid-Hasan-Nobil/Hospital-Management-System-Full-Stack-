import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { Patient } from '../patient/patient.entity';
  import { Doctor } from '../doctor/doctor.entity';
  
  @Entity()
  export class Feedback {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Patient)
    @JoinColumn({ name: 'patientId' })
    patient: Patient;
  
    @ManyToOne(() => Doctor)
    @JoinColumn({ name: 'doctorId' })
    doctor: Doctor;
  
    @Column({ type: 'int' })
    rating: number;
  
    @Column({ type: 'text', nullable: true })
    comment: string;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  