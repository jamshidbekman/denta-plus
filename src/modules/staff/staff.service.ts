import { flatten, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly patientsService: PatientsService,
  ) {}

  async getUserByPhoneNumber(phone_number: string) {
    const user = await this.staffRepository.findOne({
      where: { phone_number: phone_number },
    });

    return user;
  }

  async createClinicOwner(createStaffDto: CreateStaffDto) {
    const hashedPassword = await bcrypt.hash(createStaffDto.password, 12);

    const createStaff = this.staffRepository.create({
      ...createStaffDto,
      password: hashedPassword,
    });
    const saveStaff = await this.staffRepository.save(createStaff);

    const getCreatedStaff = await this.staffRepository.findOne({
      where: { id: saveStaff.id },
      relations: ['clinic'],
    });

    return {
      id: getCreatedStaff?.id,
      phone_number: getCreatedStaff?.phone_number,
      role: getCreatedStaff?.role,
      full_name: getCreatedStaff?.full_name,
    };
  }

  async updateLastActivity(id: number) {
    const staff = await this.staffRepository.findOne({ where: { id: id } });

    if (staff) {
      staff.last_activity = new Date().toLocaleString();
      await this.staffRepository.save(staff);
    }
  }

  async getAllStaffs() {
    const staffs = await this.staffRepository.find({
      select: {
        id: true,
        full_name: true,
        phone_number: true,
        email: true,
        role: true,
        last_activity: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: {
        clinic: true,
      },
    });

    return staffs;
  }

  async getAllUsers() {
    const staffs = await this.getAllStaffs();

    const patients = await this.patientsService.getAllPatients();

    if (!staffs || !patients)
      throw new NotFoundException('Foydalanuvchilar mavjud emas');
    return {
      message: "Barcha foydalanuvchilar ro'yxati",
      data: {
        staffs,
        patients,
      },
    };
  }
}
