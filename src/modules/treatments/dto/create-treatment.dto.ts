import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateTreatmentDto {
  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.INVALID_FORMAT' })
  name: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsString({ message: 'validation.INVALID_FORMAT' })
  description: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsNumber({}, { message: 'validation.INVALID_FORMAT' })
  @Min(0, { message: 'validation.INVALID_FORMAT' })
  price: number;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsNumber({}, { message: 'validation.INVALID_FORMAT' })
  @Min(1, { message: 'validation.INVALID_FORMAT' })
  durationMinutes: number;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsUUID('4', { message: 'validation.INVALID_FORMAT' })
  clinicId: string;

  @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
  @IsBoolean({ message: 'validation.INVALID_FORMAT' })
  isActive: boolean;
}
