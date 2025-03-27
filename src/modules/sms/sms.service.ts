import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
  private token: string;
  private loginUrl: string = 'https://notify.eskiz.uz/api/auth/login';
  private sensSmsUrl: string = 'https://notify.eskiz.uz/api/message/sms/send';
  constructor(private readonly configService: ConfigService) {}

  templateMessage(code: number): string {
    return `DENTAPLUS mobil ilovasida tizimga kirish uchun tasdiqlash kodingiz: ${code}. Iltimos, bu kodni hech kimga bermang!!!`;
  }

  async getEskizToken() {
    if (this.token) {
      return this.token;
    }

    return await this.refreshEskizToken();
  }

  async refreshEskizToken() {
    const formData = new FormData();
    const eskiz_email = this.configService.get('ESKIZ_EMAIL');
    const eskiz_password = this.configService.get('ESKIZ_PASSWORD');

    formData.set('email', eskiz_email);
    formData.set('password', eskiz_password);

    const res = await axios.post(this.loginUrl, formData, {
      headers: {
        'content-Type': 'multipart/form-data',
      },
    });
    if (res.status !== 200) {
      throw new HttpException('Xatolik yuz berdi', 500);
    }
    const token = await res.data.data.token;
    this.token = token;
    return this.token;
  }

  async sendVerificationSms(phone_number: string, otp: number) {
    const formData = new FormData();
    const smsTemplate = this.templateMessage(otp);
    formData.set('mobile_phone', phone_number);
    formData.set('message', smsTemplate);
    formData.set('from', '4546');
    try {
      const response = await axios.post(this.sensSmsUrl, formData, {
        headers: {
          Authorization: `Bearer ${await this.getEskizToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
      throw new HttpException('Xatolik yuz berdi', 500);
    }
  }
}
