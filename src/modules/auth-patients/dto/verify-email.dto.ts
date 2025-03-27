import { IsEmail, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VerifyEmailDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_FORMAT') })
  otp: number;
}
