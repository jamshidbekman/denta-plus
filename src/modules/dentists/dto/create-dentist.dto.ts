import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WorkingDayDto {
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.INVALID_FORMAT' })
  start: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.INVALID_FORMAT' })
  end: string;
}

export class WorkingHoursDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingDayDto)
  monday?: WorkingDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingDayDto)
  tuesday?: WorkingDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingDayDto)
  wednesday?: WorkingDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingDayDto)
  thursday?: WorkingDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingDayDto)
  friday?: WorkingDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingDayDto)
  saturday?: WorkingDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingDayDto)
  sunday?: WorkingDayDto;
}

export class CreateDentistDto {
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.INVALID_FORMAT' })
  fullName: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsPhoneNumber('UZ', { message: 'validation.INVALID_PHONE_NUMBER' })
  phoneNumber: string;

  @IsOptional()
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'validation.INVALID_FORMAT' })
  specialization?: string;

  @IsOptional()
  @Min(0, { message: 'validation.INVALID_FORMAT' })
  experience?: number;

  @IsOptional()
  @IsString({ message: 'validation.INVALID_FORMAT' })
  photoUrl?: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.INVALID_FORMAT' })
  clinicId: string;

  @IsOptional()
  @IsObject({ message: 'validation.INVALID_FORMAT' })
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursDto)
  workingHours?: WorkingHoursDto;
}
