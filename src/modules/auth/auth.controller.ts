import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { EmailDto } from './entities/email.dto';
import { VerifyEmailDto } from './entities/verify-email.dto';
import { CreatePatientDto } from '../patients/dto/create-patient.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('patients/sendotp/email')
  async sendOtpToEmailController(@Body() emailDto: EmailDto) {
    return await this.authService.sendOtpToEmail(emailDto);
  }

  @Post('patients/verify/email')
  async verifyEmailController(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('patients/register')
  async registerPatientController(@Body() createPatientDto: CreatePatientDto) {
    return await this.authService.registerPatient(createPatientDto);
  }
  @Post('patients/login')
  async loginPatientController(@Body() emailDto: EmailDto) {
    return await this.authService.login(emailDto);
  }

  @Post('patients/login/verify/email')
  async loginVerifyWithEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmailLogin(verifyEmailDto);
  }
}
