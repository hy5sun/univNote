import { IsEmail, IsNumber } from 'class-validator';

export class VerifyEmailCodeDto {
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @IsNumber({}, { message: '인증코드가 숫자 형태가 아닙니다.' })
  code: number;
}
