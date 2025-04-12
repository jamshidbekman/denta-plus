import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.OWNER)
  @Get('users/all')
  @ApiOperation({ description: 'Barcha foydalanuvchilarni olish' })
  @ApiResponse({
    status: 200,
    description: "Barcha foydalanivchilar ro'yxati",
  })
  @ApiResponse({
    status: 404,
    description: 'Foydalanuvchilar mavjud emas',
  })
  async GetAllUsersController() {
    return await this.staffService.getAllUsers();
  }
}
