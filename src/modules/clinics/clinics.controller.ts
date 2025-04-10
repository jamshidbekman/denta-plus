import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';
import { ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post('create')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.OWNER)
  @ApiOperation({
    summary: 'Klinika yaratish',
    description: 'Yangi klinika yaratish va klinika adminini yaratish',
  })
  @ApiBody({ type: CreateClinicDto })
  @ApiResponse({ status: 201, description: 'Klinika muvaffaqiyatli yaratildi' })
  @ApiResponse({
    status: 409,
    description:
      'Klinika bilan bog‘liq konflikt (masalan, inn, telefon raqami, nom) mavjud',
  })
  @ApiResponse({ status: 500, description: 'Ichki server xatosi' })
  async createClinicController(@Body() createClinicDto: CreateClinicDto) {
    return await this.clinicsService.createClinic(createClinicDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Klinikalar ro‘yxatini olish',
    description:
      'Klinikalar ro‘yxatini olish, agar region ko‘rsatilgan bo‘lsa, shunga qarab filtrlanadi',
  })
  @ApiQuery({
    name: 'region',
    required: false,
    description: 'Region bo‘yicha filtr',
  })
  @ApiResponse({
    status: 200,
    description: 'Klinikalar ro‘yxati muvaffaqiyatli qaytarildi',
  })
  @ApiResponse({ status: 500, description: 'Ichki server xatosi' })
  async getAllClinics(@Query('region') region?: string) {
    return await this.clinicsService.getAllClinics(region as string);
  }
}
