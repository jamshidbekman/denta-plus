import { Module } from '@nestjs/common';
import { DentistsService } from './dentists.service';
import { DentistsController } from './dentists.controller';

@Module({
  controllers: [DentistsController],
  providers: [DentistsService],
})
export class DentistsModule {}
