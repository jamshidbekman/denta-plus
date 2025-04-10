import {
  IsNotEmpty,
  IsEnum,
  IsString,
  Matches,
  IsOptional,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { ClinicType, ClinicStatus } from '../entities/clinic.entity';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClinicDto {
  @ApiProperty({ example: 'Shifo Plus', description: 'Klinika nomi' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString()
  name: string;

  @ApiProperty({
    enum: ClinicType,
    example: ClinicType.MCHJ,
    description: 'Klinika turi (masalan: MCHJ, QK, XK)',
  })
  @IsEnum(ClinicType, {
    message: i18nValidationMessage('validation.INVALID_FORMAT', {
      property: 'type',
    }),
  })
  type: ClinicType;

  @ApiProperty({
    example: '+998901234567',
    description: 'Klinikaning asosiy telefon raqami',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @Matches(/^\+998(90|91|93|94|95|97|98|99|33|88|50)\d{7}$/, {
    message: i18nValidationMessage('validation.INVALID_PHONE_NUMBER'),
  })
  phone_number: string;

  @ApiPropertyOptional({
    example: '+998991234567',
    description:
      'Administrator telefon raqami (ixtiyoriy), Agar bu yerga telefon raqam kiritilmasa administrator asosiy telefon raqam bilan tizimga kiradi',
  })
  @IsOptional()
  @Matches(/^\+998(90|91|93|94|95|97|98|99|33|88|50)\d{7}$/, {
    message: i18nValidationMessage('validation.INVALID_PHONE_NUMBER'),
  })
  admin_phone_number?: string;

  @ApiProperty({ example: 'Toshkent, Chilonzor 10', description: 'Manzil' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Fargʻona', description: 'Viloyat nomi' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString()
  region: string;

  @ApiProperty({
    example: 40.375,
    description: 'Klinikaning kenglik (latitude) koordinatasi',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsLatitude({
    message: i18nValidationMessage('validation.INVALID_FORMAT', {
      property: 'latitude',
    }),
  })
  latitude: number;

  @ApiProperty({
    example: 72.949,
    description: 'Klinikaning uzunlik (longitude) koordinatasi',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsLongitude({
    message: i18nValidationMessage('validation.INVALID_FORMAT', {
      property: 'longitude',
    }),
  })
  longitude: number;

  @ApiProperty({
    example: '12345678901234',
    description: 'Klinika STIR (INN) raqami',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString()
  inn: string;

  @ApiPropertyOptional({
    enum: ClinicStatus,
    example: ClinicStatus.ACTIVE,
    description: 'Klinika holati (ixtiyoriy)',
  })
  @IsOptional()
  @IsEnum(ClinicStatus, {
    message: i18nValidationMessage('validation.INVALID_FORMAT', {
      property: 'status',
    }),
  })
  status?: ClinicStatus;

  @ApiProperty({
    example: 'Jahon Yoqubov',
    description: 'Klinika egasining toʻliq ismi',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString()
  ownerFullName: string;
}
