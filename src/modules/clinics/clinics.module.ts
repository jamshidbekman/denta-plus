import { Module } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { ClinicsController } from './clinics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { StaffModule } from '../staff/staff.module';
import { StaffService } from '../staff/staff.service';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic]), StaffModule],
  controllers: [ClinicsController],
  providers: [ClinicsService, StaffService],
})
export class ClinicsModule {}
