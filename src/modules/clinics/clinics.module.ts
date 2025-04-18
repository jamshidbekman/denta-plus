import { Module } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { ClinicsController } from './clinics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { StaffModule } from '../staff/staff.module';
import { StaffService } from '../staff/staff.service';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic]), StaffModule, PatientsModule],
  controllers: [ClinicsController],
  providers: [ClinicsService, StaffService],
  exports: [ClinicsService, TypeOrmModule],
})
export class ClinicsModule {}
