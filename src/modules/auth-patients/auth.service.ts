import { BadRequestException, Injectable } from '@nestjs/common';
import { PatientsService } from '../patients/patients.service';
import { RedisService } from './redis.service';
import { MailService } from './mail.service';
import { I18nContext } from 'nestjs-i18n';
import { EmailDto } from './entities/email.dto';
import { VerifyEmailDto } from './entities/verify-email.dto';
import { CreatePatientDto } from '../patients/dto/create-patient.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}
  async registerPatient(createPatientDto: CreatePatientDto) {
    const isVerified = await this.redisService.getVerifiedUser(
      createPatientDto.email,
    );
    const i18n = I18nContext.current();

    if (!isVerified)
      throw new BadRequestException(i18n?.t('messages.EMAIL_NOT_VERIFIED'));

    const patient = await this.patientsService.createPatient(createPatientDto);

    const payload = { user_id: patient?.id };

    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '2d' });

    return {
      message: i18n?.t('messages.REGISTRATION_SUCCESS'),
      patient,
      access_token,
      refresh_token,
    };
  }
  async sendOtpToEmail(emailDto: EmailDto) {
    const i18n = I18nContext.current();
    const findEmail = await this.patientsService.findByEmail(emailDto.email);
    if (findEmail)
      throw new BadRequestException(
        i18n?.t('validation.ALREADY_EXISTS', { args: { property: 'Email' } }),
      );
    const otpPassword = this.redisService.generateOtpPassword();
    this.redisService.setOtp(emailDto.email, otpPassword, 120);
    this.mailService.sendOtp(emailDto.email, otpPassword);
    return {
      message: i18n?.t('messages.EMAIL_CONFIRMATION_SENT'),
      time: '2m',
    };
  }
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const i18n = I18nContext.current();
    const getOtp = await this.redisService.getOtp(verifyEmailDto.email);
    if (+(getOtp as string) !== verifyEmailDto.otp)
      throw new BadRequestException(i18n?.t('messages.OTP_EXPIRED'));

    this.redisService.setVerifiedUser(verifyEmailDto.email);
    this.redisService.delOtp(verifyEmailDto.email);
    return {
      message: i18n?.t('messages.OTP_CONFIRMED'),
    };
  }
  async login(emailDto: EmailDto) {
    const i18n = I18nContext.current();

    const findPatient = await this.patientsService.findByEmail(emailDto.email);

    if (!findPatient) {
      throw new BadRequestException(i18n?.t('messages.USER_NOT_REGISTERED'));
    }

    const otpPassword = this.redisService.generateOtpPassword();
    this.redisService.setOtp(emailDto.email, otpPassword, 120);
    this.mailService.sendOtp(emailDto.email, otpPassword);
    return {
      message: i18n?.t('messages.EMAIL_CONFIRMATION_SENT'),
      time: '2m',
    };
  }
  async verifyEmailLogin(verifyEmailDto: VerifyEmailDto) {
    const i18n = I18nContext.current();
    const getOtp = await this.redisService.getOtp(verifyEmailDto.email);
    if (+(getOtp as string) !== verifyEmailDto.otp)
      throw new BadRequestException(i18n?.t('messages.OTP_EXPIRED'));

    this.redisService.setVerifiedUser(verifyEmailDto.email);
    this.redisService.delOtp(verifyEmailDto.email);

    const patient = await this.patientsService.findByEmail(
      verifyEmailDto.email,
    );

    const payload = { user_id: patient?.id };

    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '2d' });

    return {
      message: i18n?.t('messages.LOGIN_SUCCESS'),
      access_token,
      refresh_token,
    };
  }
}
