import { Clinic } from 'src/modules/clinics/entities/clinic.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'treatments' })
export class Treatment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column()
  durationMinutes: number;

  @ManyToOne(() => Clinic, (clinic) => clinic.treatments)
  clinic: Clinic;

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
