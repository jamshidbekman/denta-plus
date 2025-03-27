import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async findByEmail(email: string) {
    return await this.patientRepository.findOne({ where: { email: email } });
  }
  async findByPhoneNumber(phoneNumber: string) {
    return await this.patientRepository.findOne({
      where: { phoneNumber: phoneNumber },
    });
  }

  async createPatient(createPatientDto: CreatePatientDto) {
    const findPatient = await this.patientRepository.findOne({
      where: { phoneNumber: createPatientDto.phoneNumber },
    });
    const i18n = I18nContext.current();
    if (findPatient?.phoneNumber == createPatientDto.phoneNumber) {
      throw new BadRequestException(
        i18n?.t('messages.PHONE_NUMBER_ALREADY_EXISTS'),
      );
    }
    const create = this.patientRepository.create(createPatientDto);
    try {
      const created = await this.patientRepository.save(create);
      return created;
    } catch (error) {
      console.log(error.message);
    }
  }
}
