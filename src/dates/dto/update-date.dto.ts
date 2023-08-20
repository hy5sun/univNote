import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDateDto {
  @IsNotEmpty({ message: '수정할 일정을 필수로 입력해야 합니다.' })
  @IsString({ message: '일정은 문자열이어야 합니다.' })
  schedule: string;

  @IsNotEmpty({ message: '날짜를 필수로 입력해야 합니다.' })
  @IsString({ message: '일정은 문자열 형식이어야 합니다.' })
  updateDate: string;
}
