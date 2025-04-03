import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StaffService } from 'src/modules/staff/staff.service';
import { LoginDto } from './dto/login.dto';
import { I18nContext } from 'nestjs-i18n';
import { generate } from 'otp-generator';
import { RedisService } from 'src/modules/redis/redis.service';
import { SmsService } from 'src/modules/sms/sms.service';
import { StaffsVerifyPhoneDto } from './dto/verify-phone.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthStaffService {
  constructor(
    private readonly staffService: StaffService,
    private readonly redisService: RedisService,
    private readonly smsService: SmsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const findUser = await this.staffService.getUserByPhoneNumber(
      loginDto.phone_number,
    );

    const i18n = I18nContext.current();

    if (!findUser) {
      throw new NotFoundException(i18n?.t('messages.USER_NOT_FOUND'));
    }

    const comparePassword = await bcrypt.compare(
      loginDto.password,
      findUser.password,
    );

    if (!comparePassword) {
      throw new BadRequestException(i18n?.t('messages.PASSWORD_INVALID'));
    }

    const code = +generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    const temp_user = {
      ...loginDto,
      role: findUser.role,
      code,
    };

    try {
      await this.redisService.setTempUser(temp_user, 3);
    } catch (error) {
      if (error.message === 'too-many-attempts') {
        throw new HttpException(
          i18n?.t('messages.TOO_MANY_ATTEMPTS') as string,
          429,
        );
      }
    }

    const smsResponse = await this.smsService.sendVerificationSms(
      loginDto.phone_number,
      code,
    );

    if (smsResponse.status !== 'waiting')
      throw new HttpException('Xatolik yuz berdi', 500);

    return {
      code_time: 3,
      message: i18n?.t('messages.PHONE_CONFIRMATION_SENT'),
    };
  }

  async loginVerify(loginVerifyDto: StaffsVerifyPhoneDto, res: Response) {
    const findUser = await this.staffService.getUserByPhoneNumber(
      loginVerifyDto.phone_number,
    );

    const i18n = I18nContext.current();

    if (!findUser) {
      throw new NotFoundException(i18n?.t('messages.USER_NOT_FOUND'));
    }

    const is_requested = await this.redisService.isCodeRequested(
      loginVerifyDto.phone_number,
    );

    if (is_requested == null)
      throw new BadRequestException(i18n?.t('messages.OTP_NOT_REQUESTED'));

    const getTempUser = await this.redisService.getTempUser(
      loginVerifyDto.phone_number,
    );

    if (getTempUser == null)
      throw new HttpException(i18n?.t('messages.OTP_EXPIRED') as string, 401);

    if (getTempUser.code !== loginVerifyDto.code)
      throw new HttpException(i18n?.t('messages.OTP_INCORRECT') as string, 401);

    const payload = { user_id: findUser?.id, role: findUser.role };

    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '10d' });

    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1 * 3600 * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 5 * 24 * 3600 * 1000,
    });

    await this.redisService.delRequests(loginVerifyDto.phone_number);

    return {
      message: i18n?.t('messages.LOGIN_SUCCESS'),
      user: {
        full_name: findUser.full_name,
        email: findUser.email,
        phone_number: findUser.phone_number,
        role: findUser.role,
      },
    };
  }
}
