import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { MailgunModule } from '@nextnm/nestjs-mailgun';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [emailConfig],
    }),
    MailgunModule.forRoot({
      username: process.env.MAILGUN_USER_NAME,
      key: process.env.MAILGUN_API_KEY,
    }),
    CacheModule.register(),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
