import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthPatientsService } from './auth.service';
import { EmailDto } from './dto/email.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { CreatePatientDto } from '../../patients/dto/create-patient.dto';
import { PatientsRegisterDto } from './dto/register.dto';
import { PatinetsVerifyPhoneDto } from './dto/verify-phone.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { PatientsLoginDto } from './dto/login.dto';

@Controller('auth/patients')
export class AuthPatientsController {
  constructor(private readonly authService: AuthPatientsService) {}

  // @Post('register/email')
  // @HttpCode(200)
  // async sendOtpToEmailController(@Body() emailDto: EmailDto) {
  //   return await this.authService.sendOtpToEmail(emailDto);
  // }

  // @HttpCode(200)
  // @Post('register/email/verify')
  // async verifyEmailController(@Body() verifyEmailDto: VerifyEmailDto) {
  //   return await this.authService.verifyEmail(verifyEmailDto);
  // }

  // @Post('register')
  // async registerPatientController(@Body() createPatientDto: CreatePatientDto) {
  //   return await this.authService.registerPatient(createPatientDto);
  // }

  // @HttpCode(200)
  // @Post('login')
  // async loginPatientController(@Body() emailDto: EmailDto) {
  //   return await this.authService.login(emailDto);
  // }

  // @HttpCode(200)
  // @Post('login/email/verify')
  // async loginVerifyWithEmail(@Body() verifyEmailDto: VerifyEmailDto) {
  //   return await this.authService.verifyEmailLogin(verifyEmailDto);
  // }

  @Post('register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Foydalanuvchini ro‘yxatdan o‘tkazish' })
  @ApiBody({ type: PatientsRegisterDto })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: 'Til kodi (en, uz, ru)',
    example: 'uz',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasdiqlash kodi telefon raqamingizga yuborildi.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bu telefon raqami bilan allaqachon ro‘yxatdan o‘tilgan. Iltimos, login qiling.',
  })
  async registerController(@Body() registerDto: PatientsRegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('register/verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Telefon raqamini tasdiqlash' })
  @ApiBody({ type: PatinetsVerifyPhoneDto })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: 'Til kodi (en, uz, ru)',
    example: 'uz',
  })
  @ApiResponse({
    status: 200,
    description: 'Siz muvaffaqiyatli ro‘yxatdan o‘tdingiz! Xush kelibsiz!',
  })
  @ApiResponse({
    status: 401,
    description: 'Tasdiqlash kodi noto‘g‘ri yoki eskirgan.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Bu telefon raqami bilan allaqachon ro‘yxatdan o‘tilgan. Iltimos, login qiling.',
  })
  @ApiResponse({
    status: 400,
    description: 'Tasdiqlash kodini olish uchun avval so‘rov yuboring.',
  })
  async registerVerifyPhoneController(
    @Body() verifyDto: PatinetsVerifyPhoneDto,
  ) {
    return await this.authService.registerVerify(verifyDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Telefon raqam orqali login qilish' })
  @ApiResponse({
    status: 200,
    description: 'Tasdiqlash kodi telefon raqamingizga yuborildi.',
  })
  @ApiResponse({
    status: 429,
    description: "Urinishlar soni tugadi, birozdan keyin urinib ko'ring.",
  })
  @ApiResponse({
    status: 401,
    description:
      'Sizning telefon raqamingiz ro‘yxatdan o‘tmagan. Iltimos, avval ro‘yxatdan o‘ting.',
  })
  async login(@Body() loginDto: PatientsLoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('login/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'OTP kodini tasdiqlash va loginni yakunlash' })
  @ApiResponse({
    status: 200,
    description: 'Siz muvaffaqiyatli tizimga kirdingiz.',
  })
  @ApiResponse({
    status: 400,
    description: 'Tasdiqlash kodini olish uchun avval so‘rov yuboring.',
  })
  @ApiResponse({
    status: 401,
    description: 'Tasdiqlash kodi noto‘g‘ri yoki eskirgan.',
  })
  async loginVerify(@Body() verifyDto: PatinetsVerifyPhoneDto) {
    return this.authService.loginVerify(verifyDto);
  }
}
