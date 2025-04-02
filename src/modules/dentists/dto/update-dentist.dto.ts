import { PartialType } from '@nestjs/swagger';
import { CreateDentistDto } from './create-dentist.dto';

export class UpdateDentistDto extends PartialType(CreateDentistDto) {}
