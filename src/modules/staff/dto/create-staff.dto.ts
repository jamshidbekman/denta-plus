import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  isObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { StaffRole } from '../entities/staff.entity';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  full_name: string;

  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  @Matches(/^\+998(90|91|93|94|95|97|98|99|33|88|50)\d{7}$/, {
    message: i18nValidationMessage('validation.INVALID_PHONE_NUMBER'),
  })
  phone_number: string;

  @IsOptional()
  @IsString()
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email?: string;

  @IsString()
  @MinLength(6, {
    message: i18nValidationMessage('validation.PASSWORD_MIN_LENGTH'),
  })
  password: string;

  @IsObject()
  clinic: {
    id: string;
  };

  @IsEnum(StaffRole, {
    message: i18nValidationMessage('validation.INVALID_ROLE'),
  })
  role: StaffRole;
}
