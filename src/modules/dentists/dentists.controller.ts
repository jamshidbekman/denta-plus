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
import { DentistsService } from './dentists.service';
import { CreateDentistDto } from './dto/create-dentist.dto';
import { UpdateDentistDto } from './dto/update-dentist.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';
import { ApiOperation } from '@nestjs/swagger';

@Controller('dentists')
export class DentistsController {
  constructor(private readonly dentistsService: DentistsService) {}

  @ApiOperation({ summary: 'Stomatolog yaratish' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.CLINIC_OWNER)
  @Post('create')
  async CreateDentist(@Body() createDentistDto: CreateDentistDto) {
    return await this.dentistsService.createDentist(createDentistDto);
  }
}
