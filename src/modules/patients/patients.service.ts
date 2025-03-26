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

  async createPatient(createPatientDto: CreatePatientDto) {
    const findPatient = await this.patientRepository.findOne({
      where: [
        { username: createPatientDto.username },
        { phoneNumber: createPatientDto.phoneNumber },
        { email: createPatientDto.email },
      ],
    });
    const i18n = I18nContext.current();
    if (findPatient?.username === createPatientDto.username) {
      throw new BadRequestException(
        i18n?.t('validation.ALREADY_EXISTS', {
          args: { property: 'username' },
        }),
      );
    } else if (findPatient?.phoneNumber == createPatientDto.phoneNumber) {
      throw new BadRequestException(
        i18n?.t('validation.ALREADY_EXISTS', {
          args: { property: 'phone number' },
        }),
      );
    } else if (findPatient?.email == createPatientDto.email) {
      throw new BadRequestException(
        i18n?.t('validation.ALREADY_EXISTS', {
          args: { property: 'email' },
        }),
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
