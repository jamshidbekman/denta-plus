import { Module } from '@nestjs/common';
import { DentistsService } from './dentists.service';
import { DentistsController } from './dentists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dentist } from './entities/dentist.entity';
import { ClinicsService } from '../clinics/clinics.service';
import { ClinicsModule } from '../clinics/clinics.module';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dentist]), ClinicsModule, StaffModule],
  controllers: [DentistsController],
  providers: [DentistsService, ClinicsService],
})
export class DentistsModule {}
