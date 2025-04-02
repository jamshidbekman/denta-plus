import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Res,
} from '@nestjs/common';
import { AuthStaffService } from './auth-staff.service';
import { LoginDto } from './dto/login.dto';
import { StaffsVerifyPhoneDto } from './dto/verify-phone.dto';
import { Response } from 'express';

@Controller('auth/staff')
export class AuthStaffController {
  constructor(private readonly authStaffService: AuthStaffService) {}

  @Post('login')
  @HttpCode(200)
  async loginController(@Body() loginDto: LoginDto) {
    return await this.authStaffService.login(loginDto);
  }

  @Post('login/verify')
  @HttpCode(200)
  async loginVerifyController(
    @Body() loginVerifyDto: StaffsVerifyPhoneDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authStaffService.loginVerify(loginVerifyDto, res);
  }
}
