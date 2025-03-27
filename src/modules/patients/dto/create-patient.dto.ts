import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  fullName: string;

  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  @Matches(/^\+998(90|91|93|94|95|97|98|99|33|88)\d{7}$/, {
    message: i18nValidationMessage('validation.INVALID_PHONE_NUMBER'),
  })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  email?: string;

  @IsOptional()
  @IsDate({
    message: i18nValidationMessage('validation.INVALID_FORMAT'),
  })
  birthDate?: Date;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.INVALID_FORMAT'),
  })
  adress?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.INVALID_FORMAT'),
  })
  gender?: string;
}
