import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @IsString({ message: '비밀번호가 문자열 형식이 아닙니다.' })
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_\-+=`|\(){}[\]:;"'<>,.?/])(?=.*[0-9]).{8,14}$/,
    {
      message: '영어, 숫자, 특수문자를 포함하여 8~14자의 비밀번호를 써주세요.',
    },
  )
  password: string;

  @IsString({ message: '이름이 문자열 형식이 아닙니다.' })
  @MinLength(2, {
    message: '이름은 2글자 이상 입력해야 합니다.',
  })
  @MaxLength(5, {
    message: '이름은 5글자 이하로 입력해야 합니다.',
  })
  name: string;

  @IsString({ message: '대학교 명이 문자열 형식이 아닙니다.' })
  univ: string;

  @IsString({ message: '학과 명이 문자열 형식이 아닙니다.' })
  @MinLength(3, {
    message: '학과는 3글자 이상 입력해야 합니다.',
  })
  @MaxLength(15, {
    message: '학과는 15글자 이하로 입력해야 합니다.',
  })
  department: string;

  @IsString({ message: '입학 날짜가 문자열 형식이 아닙니다.' })
  admissionDate: string;

  @IsString({ message: '졸업 예정 날짜가 문자열 형식이 아닙니다.' })
  expectedGraduationDate: string;
}
