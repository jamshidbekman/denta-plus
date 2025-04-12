import { Clinic } from 'src/modules/clinics/entities/clinic.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum StaffRole {
  CRM_OWNER = 'crm-owner',
  CLINIC_OWNER = 'clinic-owner',
  RECEPTIONIST = 'receptionist',
}

@Entity({ name: 'staffs' })
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Clinic, (clinic) => clinic.staffs)
  clinic: Clinic;

  @Column({
    type: 'enum',
    enum: StaffRole,
  })
  role: StaffRole;

  @Column({ nullable: true, default: new Date().toLocaleString() })
  last_activity: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
