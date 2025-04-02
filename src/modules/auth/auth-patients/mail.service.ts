import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendOtp(email: string, otp: number) {
    try {
      await this.mailerService.sendMail({
        from: 'Denta+',
        to: email,
        subject: 'Denta+',
        text: `Tasdiqlash kodi: ${otp}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}
