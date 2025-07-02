import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  password: string; // Hashed password

  @Column({ nullable: true })
  insuranceDetails: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
