import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { PatientsModule } from '../patients/patients.module';
import { PatientsService } from '../patients/patients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Staff]), PatientsModule],
  controllers: [StaffController],
  providers: [StaffService, PatientsService],
  exports: [StaffService, TypeOrmModule],
})
export class StaffModule {}
