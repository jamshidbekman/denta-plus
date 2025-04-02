import { Module } from '@nestjs/common';
import { AuthStaffService } from './auth-staff.service';
import { AuthStaffController } from './auth-staff.controller';
import { StaffModule } from 'src/modules/staff/staff.module';
import { SmsModule } from 'src/modules/sms/sms.module';
import { RedisModule } from 'src/modules/redis/redis.module';
import { SmsService } from 'src/modules/sms/sms.service';
import { RedisService } from 'src/modules/redis/redis.service';

@Module({
  imports: [StaffModule, SmsModule, RedisModule],
  controllers: [AuthStaffController],
  providers: [AuthStaffService, SmsService, RedisService],
})
export class AuthStaffModule {}
