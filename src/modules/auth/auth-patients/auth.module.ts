import { Module } from '@nestjs/common';
import { AuthPatientsService } from './auth.service';
import { AuthPatientsController } from './auth.controller';
import { PatientsModule } from '../../patients/patients.module';
import { MailService } from './mail.service';
import { RedisService } from '../../redis/redis.service';
import { RedisModule } from '../../redis/redis.module';
import { SmsModule } from '../../sms/sms.module';
import { SmsService } from '../../sms/sms.service';

@Module({
  imports: [PatientsModule, RedisModule, SmsModule],
  controllers: [AuthPatientsController],
  providers: [AuthPatientsService, MailService, RedisService, SmsService],
})
export class AuthPatientsModule {}
