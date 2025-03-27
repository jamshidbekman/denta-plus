import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PatinetsVerifyPhoneDto {
  @ApiProperty({
    description: 'Foydalanuvchi telefon raqami',
    example: '+998991234567',
  })
  @IsString({
    message: i18nValidationMessage('validation.INVALID_FORMAT'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  @Matches(/^\+998(90|91|93|94|95|97|98|99|33|88)\d{7}$/, {
    message: i18nValidationMessage('validation.INVALID_PHONE_NUMBER'),
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Telefon raqamga yuborilgan kod',
    example: '000123',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('validation.INVALID_FORMAT'),
    },
  )
  code: number;
}
