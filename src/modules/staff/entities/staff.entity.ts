import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({
    type: 'enum',
    enum: StaffRole,
  })
  role: StaffRole;

  @Column({ default: true })
  isActive: boolean;
}
