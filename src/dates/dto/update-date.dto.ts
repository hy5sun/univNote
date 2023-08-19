import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDateDto {
  @IsString({ message: '일정은 문자열이어야 합니다.' })
  schedule: string;

  @IsNotEmpty({ message: '날짜는 필수 입력해야 합니다.' })
  @IsString({ message: '일정은 문자열 형식이어야 합니다.' })
  updateDate: string;
}
