import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
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
}
