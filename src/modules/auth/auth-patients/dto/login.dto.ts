import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PatientsLoginDto {
  @IsString({ message: i18nValidationMessage('validation.INVALID_FORMAT') })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  @Matches(/^\+998(90|91|93|94|95|97|98|99|33|88|50)\d{7}$/, {
    message: i18nValidationMessage('validation.INVALID_PHONE_NUMBER'),
  })
  phoneNumber: string;
}
