import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PatientsModule } from '../patients/patients.module';
import { MailService } from './mail.service';
import { RedisService } from './redis.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PatientsModule],
  controllers: [AuthController],
  providers: [AuthService, MailService, RedisService],
})
export class AuthModule {}
