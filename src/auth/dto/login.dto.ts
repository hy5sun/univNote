import { IsEmail, IsString } from 'class-validator';

export class LogInDto {
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @IsString({ message: '비밀번호가 문자열 형식이 아닙니다.' })
  password: string;
}
