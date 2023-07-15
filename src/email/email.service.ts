import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EmailOptions, MailgunService } from '@nextnm/nestjs-mailgun';
import { Cache } from 'cache-manager';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailgun: MailgunService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async send(email: string, code: number) {
    const mail: EmailOptions = {
      to: email,
      from: process.env.EMAIL_ADDRESS,
      subject: '인증번호를 입력해주세요.',
      html: `<p>인증번호는 [ ${code} ] 입니다.</p>`,
    };

    await this.mailgun.createEmail(process.env.MAILGUN_DOMAIN, mail);

    console.log(code);
    console.log(`Email sent to ${mail.to}`);
  }
}
