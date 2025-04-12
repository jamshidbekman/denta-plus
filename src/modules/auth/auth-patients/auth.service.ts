import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PatientsService } from '../../patients/patients.service';
import { RedisService } from '../../redis/redis.service';
import { MailService } from './mail.service';
import { I18nContext } from 'nestjs-i18n';
import { EmailDto } from './dto/email.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { CreatePatientDto } from '../../patients/dto/create-patient.dto';
import { JwtService } from '@nestjs/jwt';
import { PatientsRegisterDto } from './dto/register.dto';
import { generate } from 'otp-generator';
import { SmsService } from '../../sms/sms.service';
import { PatinetsVerifyPhoneDto } from './dto/verify-phone.dto';
import { PatientsLoginDto } from './dto/login.dto';

@Injectable()
export class AuthPatientsService {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}
  // async registerPatient(createPatientDto: CreatePatientDto) {
  //   const isVerified = await this.redisService.getVerifiedUser(
  //     createPatientDto.email,
  //   );
  //   const i18n = I18nContext.current();

  //   if (!isVerified)
  //     throw new BadRequestException(i18n?.t('messages.EMAIL_NOT_VERIFIED'));

  //   const patient = await this.patientsService.createPatient(createPatientDto);

  //   const payload = { user_id: patient?.id };

  //   const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
  //   const refresh_token = this.jwtService.sign(payload, { expiresIn: '2d' });

  //   return {
  //     message: i18n?.t('messages.REGISTRATION_SUCCESS'),
  //     patient,
  //     access_token,
  //     refresh_token,
  //   };
  // }
  // async sendOtpToEmail(emailDto: EmailDto) {
  //   const i18n = I18nContext.current();
  //   const findEmail = await this.patientsService.findByEmail(emailDto.email);
  //   if (findEmail)
  //     throw new BadRequestException(
  //       i18n?.t('validation.ALREADY_EXISTS', { args: { property: 'Email' } }),
  //     );
  //   const otpPassword = this.redisService.generateOtpPassword();
  //   this.redisService.setOtp(emailDto.email, otpPassword, 120);
  //   this.mailService.sendOtp(emailDto.email, otpPassword);
  //   return {
  //     message: i18n?.t('messages.EMAIL_CONFIRMATION_SENT'),
  //     time: '2m',
  //   };
  // }
  // async verifyEmail(verifyEmailDto: VerifyEmailDto) {
  //   const i18n = I18nContext.current();
  //   const getOtp = await this.redisService.getOtp(verifyEmailDto.email);
  //   if (+(getOtp as string) !== verifyEmailDto.otp)
  //     throw new BadRequestException(i18n?.t('messages.OTP_EXPIRED'));

  //   this.redisService.setVerifiedUser(verifyEmailDto.email);
  //   this.redisService.delOtp(verifyEmailDto.email);
  //   return {
  //     message: i18n?.t('messages.OTP_CONFIRMED'),
  //   };
  // }
  // async login(emailDto: EmailDto) {
  //   const i18n = I18nContext.current();

  //   const findPatient = await this.patientsService.findByEmail(emailDto.email);

  //   if (!findPatient) {
  //     throw new BadRequestException(i18n?.t('messages.USER_NOT_REGISTERED'));
  //   }

  //   const otpPassword = this.redisService.generateOtpPassword();
  //   this.redisService.setOtp(emailDto.email, otpPassword, 120);
  //   this.mailService.sendOtp(emailDto.email, otpPassword);
  //   return {
  //     message: i18n?.t('messages.EMAIL_CONFIRMATION_SENT'),
  //     time: '2m',
  //   };
  // }
  // async verifyEmailLogin(verifyEmailDto: VerifyEmailDto) {
  //   const i18n = I18nContext.current();
  //   const getOtp = await this.redisService.getOtp(verifyEmailDto.email);
  //   if (+(getOtp as string) !== verifyEmailDto.otp)
  //     throw new BadRequestException(i18n?.t('messages.OTP_EXPIRED'));

  //   this.redisService.setVerifiedUser(verifyEmailDto.email);
  //   this.redisService.delOtp(verifyEmailDto.email);

  //   const patient = await this.patientsService.findByEmail(
  //     verifyEmailDto.email,
  //   );

  //   const payload = { user_id: patient?.id };

  //   const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
  //   const refresh_token = this.jwtService.sign(payload, { expiresIn: '2d' });

  //   return {
  //     message: i18n?.t('messages.LOGIN_SUCCESS'),
  //     access_token,
  //     refresh_token,
  //   };
  // }

  async register(registerDto: PatientsRegisterDto) {
    const findPatient = await this.patientsService.findByPhoneNumber(
      registerDto.phoneNumber,
    );

    const i18n = I18nContext.current();

    if (findPatient?.phoneNumber == registerDto.phoneNumber) {
      throw new BadRequestException(
        i18n?.t('messages.PHONE_NUMBER_ALREADY_EXISTS'),
      );
    }

    const code = +generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    const temp_user = {
      ...registerDto,
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
      registerDto.phoneNumber,
      code,
    );

    if (smsResponse.status !== 'waiting')
      throw new HttpException('Xatolik yuz berdi', 500);
    return {
      code_time: 3,
      message: i18n?.t('messages.PHONE_CONFIRMATION_SENT'),
    };
  }

  async registerVerify(verifyDto: PatinetsVerifyPhoneDto) {
    const findPatient = await this.patientsService.findByPhoneNumber(
      verifyDto.phoneNumber,
    );

    const i18n = I18nContext.current();

    if (findPatient?.phoneNumber == verifyDto.phoneNumber) {
      throw new HttpException(
        i18n?.t('messages.PHONE_NUMBER_ALREADY_EXISTS') as string,
        409,
      );
    }
    const is_requested = await this.redisService.isCodeRequested(
      verifyDto.phoneNumber,
    );

    if (is_requested == null)
      throw new BadRequestException(i18n?.t('messages.OTP_NOT_REQUESTED'));

    const getTempUser = await this.redisService.getTempUser(
      verifyDto.phoneNumber,
    );

    if (getTempUser == null)
      throw new HttpException(i18n?.t('messages.OTP_EXPIRED') as string, 401);

    if (getTempUser.code !== verifyDto.code)
      throw new HttpException(i18n?.t('messages.OTP_INCORRECT') as string, 401);

    const patient_data = {
      fullName: getTempUser.fullName,
      phoneNumber: verifyDto.phoneNumber,
    };

    const patient = await this.patientsService.createPatient(patient_data);

    await this.patientsService.updateLastActivity(patient?.id as number);

    const payload = { user_id: patient?.id };

    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '10d' });

    return {
      message: i18n?.t('messages.REGISTRATION_SUCCESS'),
      data: {
        patient,
        tokens: {
          access_token,
          refresh_token,
        },
      },
    };
  }

  async login(loginDto: PatientsLoginDto) {
    const findPatient = await this.patientsService.findByPhoneNumber(
      loginDto.phoneNumber,
    );

    const i18n = I18nContext.current();

    if (!findPatient) {
      throw new UnauthorizedException(
        i18n?.t('messages.USER_PHONE_NOT_REGISTERED'),
      );
    }

    const code = +generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    const temp_user = {
      ...loginDto,
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
      loginDto.phoneNumber,
      code,
    );

    if (smsResponse.status !== 'waiting')
      throw new HttpException('Xatolik yuz berdi', 500);

    return {
      code_time: 3,
      message: i18n?.t('messages.PHONE_CONFIRMATION_SENT'),
    };
  }

  async loginVerify(verifyDto: PatinetsVerifyPhoneDto) {
    const findPatient = await this.patientsService.findByPhoneNumber(
      verifyDto.phoneNumber,
    );

    const i18n = I18nContext.current();

    if (!findPatient) {
      throw new UnauthorizedException(
        i18n?.t('messages.USER_PHONE_NOT_REGISTERED'),
      );
    }

    const is_requested = await this.redisService.isCodeRequested(
      verifyDto.phoneNumber,
    );

    if (is_requested == null)
      throw new BadRequestException(i18n?.t('messages.OTP_NOT_REQUESTED'));

    const getTempUser = await this.redisService.getTempUser(
      verifyDto.phoneNumber,
    );

    if (getTempUser == null)
      throw new HttpException(i18n?.t('messages.OTP_EXPIRED') as string, 401);

    if (getTempUser.code !== verifyDto.code)
      throw new HttpException(i18n?.t('messages.OTP_INCORRECT') as string, 401);

    const patient = await this.patientsService.findByPhoneNumber(
      verifyDto.phoneNumber,
    );

    await this.patientsService.updateLastActivity(patient?.id as number);

    const payload = { user_id: patient?.id };

    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '10d' });

    await this.redisService.delRequests(verifyDto.phoneNumber);

    return {
      message: i18n?.t('messages.LOGIN_SUCCESS'),
      data: {
        patient,
        tokens: {
          access_token,
          refresh_token,
        },
      },
    };
  }
}
