import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DentistsService } from './dentists.service';
import { CreateDentistDto } from './dto/create-dentist.dto';
import { UpdateDentistDto } from './dto/update-dentist.dto';

@Controller('dentists')
export class DentistsController {
  constructor(private readonly dentistsService: DentistsService) {}

}
