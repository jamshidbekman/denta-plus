import { IsEmail, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class EmailDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;
}
