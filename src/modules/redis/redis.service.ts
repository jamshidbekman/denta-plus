import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { generate } from 'otp-generator';
@Injectable()
export class RedisService {
  redis: Redis;
  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      port: this.configService.get('REDIS_PORT'),
      host: this.configService.get('REDIS_HOST'),
      username: this.configService.get('REDIS_USERNAME'),
      password: this.configService.get('REDIS_PASSWORD'),
    });
  }
  // setOtp(data: string, otp: string, ttl = 60) {
  //   this.redis.setex(`user:${data}`, ttl, otp);
  // }
  // async getOtp(data: string) {
  //   return await this.redis.get(`user:${data}`);
  // }

  // setVerifiedUser(data: any) {
  //   this.redis.setex(`verifiedUser:${data}`, 180, 1);
  // }
  // async getVerifiedUser(data: any) {
  //   return await this.redis.get(`verifiedUser:${data}`);
  // }

  // setTempUser(user: { phone_number: string; password: string }) {
  //   this.redis.setex(
  //     `temp_user:${user.phone_number}`,
  //     100,
  //     JSON.stringify(user),
  //   );
  // }

  // setIncrementKey(phone_number: string) {
  //   this.redis.incr(`attempts_user:${phone_number}`);
  //   this.redis.expire(`attempts_user:${phone_number}`, 50);
  // }

  // delOtp(data: string) {
  //   this.redis.del(`user:${data}`);
  // }

  // delTempUser(key: string) {
  //   this.redis.del(`temp_user:${key}`);
  // }

  // generateOtpPassword() {
  //   const password = generate(4, {
  //     digits: true,
  //     lowerCaseAlphabets: false,
  //     specialChars: false,
  //     upperCaseAlphabets: false,
  //   });
  //   return password;
  // }

  async setKey(key: string, value: any, time: number) {
    await this.redis.setex(key, time, JSON.stringify(value));
  }
  async getKey(key: string) {
    return await this.redis.get(key);
  }
  async delKey(key: string) {
    await this.redis.del(key);
  }

  async setTempUser(user: any, min: number) {
    const attempts = Number(
      await this.isCodeRequested(user.phoneNumber || user.phone_number),
    );

    if (attempts == 3) {
      throw new Error('too-many-attempts');
    }

    await this.redis.setex(
      `user:${user.phoneNumber || user.phone_number}`,
      60 * min,
      JSON.stringify(user),
    );
    await this.redis.setex(
      `requested:${user.phoneNumber || user.phone_number}`,
      3600,
      attempts + 1,
    );
  }

  async getTempUser(phoneNumber: string) {
    return JSON.parse((await this.getKey(`user:${phoneNumber}`)) as string);
  }

  async isCodeRequested(phoneNumber: string) {
    return await this.getKey(`requested:${phoneNumber}`);
  }

  async delRequests(phoneNumber: string) {
    await this.delKey(`requested:${phoneNumber}`);
  }
}
