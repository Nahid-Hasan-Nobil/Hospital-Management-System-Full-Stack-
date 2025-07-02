import { Entity, PrimaryGeneratedColumn, Column, } from 'typeorm';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  specialty: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  password: string;

  @Column({ nullable: true })
  education: string; // degrees, university etc.

}
