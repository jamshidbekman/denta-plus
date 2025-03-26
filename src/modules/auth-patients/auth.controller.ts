import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto } from './entities/email.dto';
import { VerifyEmailDto } from './entities/verify-email.dto';
import { CreatePatientDto } from '../patients/dto/create-patient.dto';

@Controller('auth/patients')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/email')
  @HttpCode(200)
  async sendOtpToEmailController(@Body() emailDto: EmailDto) {
    return await this.authService.sendOtpToEmail(emailDto);
  }

  @HttpCode(200)
  @Post('register/email/verify')
  async verifyEmailController(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('register')
  async registerPatientController(@Body() createPatientDto: CreatePatientDto) {
    return await this.authService.registerPatient(createPatientDto);
  }

  @HttpCode(200)
  @Post('login')
  async loginPatientController(@Body() emailDto: EmailDto) {
    return await this.authService.login(emailDto);
  }

  @HttpCode(200)
  @Post('login/email/verify')
  async loginVerifyWithEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmailLogin(verifyEmailDto);
  }
}
