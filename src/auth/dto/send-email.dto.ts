import { IsEmail } from 'class-validator';

export class SendEmailDto {
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;
}
