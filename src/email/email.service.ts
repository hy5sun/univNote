import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { EmailOptions, MailgunService } from '@nextnm/nestjs-mailgun';
import { Cache } from 'cache-manager';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class EmailService {
  constructor(
    private readonly mailgun: MailgunService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async send(email: string) {
    const code = Math.floor(Math.random() * 10000);

    const mail: EmailOptions = {
      to: email,
      from: process.env.EMAIL_ADDRESS,
      subject: '인증번호를 입력해주세요.',
      html: `<p>인증번호는 [ ${code} ] 입니다.</p>`,
    };
    await this.mailgun.createEmail(process.env.MAILGUN_DOMAIN, mail);
    await this.cacheManager.set(email, code);

    console.log(code);
    console.log(`Email sent to ${mail.to}`);
  }
}
