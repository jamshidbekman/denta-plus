import { Staff } from 'src/modules/staff/entities/staff.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum ClinicType {
  MCHJ = 'MCHJ',
  XK = 'XK',
  QK = 'QK',
  YATT = 'YATT',
  OTHER = 'boshqa',
}

export enum ClinicStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

@Entity({ name: 'clinics' })
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ClinicType,
    default: ClinicType.MCHJ,
  })
  type: ClinicType;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  admin_phone_number?: string;

  @Column()
  address: string;

  @Column()
  region: string;

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;

  @Column({ unique: true })
  inn: string;

  @Column({
    type: 'enum',
    enum: ClinicStatus,
    default: ClinicStatus.ACTIVE,
  })
  status: ClinicStatus;

  @Column()
  ownerFullName: string;

  @OneToMany(() => Staff, (staff) => staff.clinic)
  staffs: Staff[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
