import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({
  name: 'patients',
})
export class Patient {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ unique: true, length: 20 })
  username: string;

  @Column({ length: 50 })
  fullName: string;

  @Column({ unique: true, length: 15 })
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ enum: ['male', 'female'], nullable: true })
  gender: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ default: true, nullable: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //   @OneToMany(() => Appointment, (appointment) => appointment.patient)
  //   appointments: Appointment[];

  //   @OneToMany(() => Payment, (payment) => payment.patient)
  //   payments: Payment[];
}
