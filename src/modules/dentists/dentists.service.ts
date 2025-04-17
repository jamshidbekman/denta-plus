import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDentistDto } from './dto/create-dentist.dto';
import { UpdateDentistDto } from './dto/update-dentist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dentist } from './entities/dentist.entity';
import { Repository } from 'typeorm';
import { I18nContext } from 'nestjs-i18n';
import { generate } from 'generate-password';
import * as bcrypt from 'bcrypt';
import { logger } from 'src/common/utils/logger';
import { ClinicsService } from '../clinics/clinics.service';

@Injectable()
export class DentistsService {
  constructor(
    @InjectRepository(Dentist)
    private readonly dentistRepository: Repository<Dentist>,
    private readonly clinicService: ClinicsService,
  ) {}

  async createDentist(createDentistDto: CreateDentistDto) {
    const findDentist = await this.dentistRepository.findOne({
      where: { phoneNumber: createDentistDto.phoneNumber },
    });

    const i18n = I18nContext.current();

    if (findDentist)
      throw new ConflictException(
        i18n?.t('validation.USER_ALREADY_EXISTS', {
          args: { property: 'phone number' },
        }),
      );

    const findClinic = await this.clinicService.getClinicById(
      createDentistDto.clinicId,
    );

    if (!findClinic)
      throw new NotFoundException(
        i18n?.t('messages.NOT_EXIST', { args: { property: 'clinic' } }),
      );

    const password = generate({
      numbers: true,
      length: 8,
      lowercase: true,
      uppercase: false,
      strict: false,
      symbols: false,
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    const dentist = this.dentistRepository.create({
      ...createDentistDto,
      clinic: { id: createDentistDto.clinicId },
      password: hashedPassword,
    });

    try {
      const create = await this.dentistRepository.save(dentist);

      const getDentist = await this.dentistRepository.findOne({
        where: { id: create.id },
        relations: ['clinic'],
      });

      return {
        message: i18n?.t('messages.SUCCESS_CREATED', {
          args: { property: 'Dentist' },
        }),
        data: {
          ...getDentist,
          password: password,
        },
      };
    } catch (error) {
      logger.error(error.message);
      throw new InternalServerErrorException();
    }
  }
}
