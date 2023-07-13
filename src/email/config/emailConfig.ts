import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
  MAILGUN_USER_NAME: process.env.MAILGUN_USER_NAME,
}));
