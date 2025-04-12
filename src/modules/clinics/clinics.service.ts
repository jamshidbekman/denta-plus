import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { Repository } from 'typeorm';
import { StaffService } from '../staff/staff.service';
import { logger } from 'src/common/utils/logger';
import { CreateStaffDto } from '../staff/dto/create-staff.dto';
import { StaffRole } from '../staff/entities/staff.entity';
import { generate } from 'generate-password';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
    private readonly staffService: StaffService,
  ) {}

  async createClinic(createClinicDto: CreateClinicDto) {
    const findClinic = await this.clinicRepository.findOne({
      where: [
        { inn: createClinicDto.inn },
        { phone_number: createClinicDto.phone_number },
        { name: createClinicDto.name },
      ],
    });

    if (findClinic)
      throw new ConflictException(
        'Bu inn, telefon raqam yoki nom bilan avval klinika yaratilgan',
      );

    const findOwnerByPhoneNumber = await this.staffService.getUserByPhoneNumber(
      createClinicDto.phone_number,
    );
    const findUserByPhoneNumber = await this.staffService.getUserByPhoneNumber(
      createClinicDto.admin_phone_number as string,
    );

    if (findOwnerByPhoneNumber && findUserByPhoneNumber)
      throw new ConflictException(
        'Ushbu telefon raqam bilan avval owner yaratilgan, Iltimos boshqa telefon raqam kiriting!',
      );

    try {
      const createClinic = this.clinicRepository.create(createClinicDto);
      const saveClinic = await this.clinicRepository.save(createClinic);
      const password = generate({
        numbers: true,
        length: 8,
        lowercase: true,
        uppercase: false,
        strict: false,
        symbols: false,
      });
      const owner: CreateStaffDto = {
        full_name: saveClinic.ownerFullName,
        role: StaffRole.CLINIC_OWNER,
        phone_number:
          createClinicDto.admin_phone_number ?? createClinicDto.phone_number,
        clinic: { id: saveClinic.id },
        password: password,
      };
      const createdOwner = await this.staffService.createClinicOwner(owner);

      return {
        message: 'Klinika muvaffaqqiyatli yaratildi',
        data: {
          clinic: saveClinic,
          clinic_owner: { ...createdOwner, password },
        },
      };
    } catch (error) {
      logger.error(error.message);
      throw new InternalServerErrorException();
    }
  }

  async getAllClinics(region: string) {
    const query = this.clinicRepository
      .createQueryBuilder('clinic')
      .leftJoinAndSelect('clinic.staffs', 'staff')
      .select([
        'clinic.id',
        'clinic.name',
        'clinic.type',
        'clinic.phone_number',
        'clinic.admin_phone_number',
        'clinic.address',
        'clinic.region',
        'clinic.latitude',
        'clinic.longitude',
        'clinic.inn',
        'clinic.status',
        'clinic.ownerFullName',
        'clinic.createdAt',
        'clinic.updatedAt',
        'staff.id',
        'staff.full_name',
        'staff.phone_number',
        'staff.role',
        'staff.isActive',
        'staff.createdAt',
        'staff.updatedAt',
      ]);

    if (region) {
      query.where('clinic.region = :region', { region });
    }

    const clinics = await query.getMany();

    if (clinics.length < 1)
      throw new NotFoundException('Klinikalar mavjud emas');
    
    return { message: "Klinikalar ro'yxati", data: clinics };
  }
}
