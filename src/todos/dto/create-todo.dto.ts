import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty({ message: '년도는 필수 입력해야합니다.' })
  @IsString({ message: '년도는 문자열 형식이어야 합니다.' })
  year: string;

  @IsNotEmpty({ message: '내용은 필수 입력해야합니다.' })
  @IsString({ message: '내용은 문자열 형식이어야 합니다.' })
  content: string;
}
