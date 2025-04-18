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
  UseGuards,
} from '@nestjs/common';
import { AuthStaffService } from './auth-staff.service';
import { LoginDto } from './dto/login.dto';
import { StaffsVerifyPhoneDto } from './dto/verify-phone.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';

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

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }
}
