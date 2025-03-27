import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';

@Module({
  imports: [],
  providers: [SmsService],
  exports: [],
})
export class SmsModule {}
