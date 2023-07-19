import { registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export enum Category {
  onCampusAct = '교내활동',
  extraAct = '교외활동',
  volunteer = '봉사활동',
  certificate = '자격증',
  etc = '기타',
}

registerEnumType(Category, { name: 'Category' });

export class CreateRecordDto {
  @IsEnum(Category, {
    message:
      '카테고리는 교내활동, 교외활동, 봉사활동, 자격증, 기타 중에서 선택해야 합니다.',
  })
  @IsNotEmpty({ message: '카테고리는 필수 입력해야합니다.' })
  category: Category;

  @IsNotEmpty({ message: '활동 이름은 필수 입력해야합니다.' })
  @IsString({ message: '제목은 문자열 형식이어야 합니다.' })
  title: string;

  @IsNotEmpty({ message: '활동 내역은 필수 입력해야합니다.' })
  @IsString({ message: '제목은 문자열 형식이어야 합니다.' })
  content: string;

  @IsNotEmpty({ message: '활동이 시작한 날짜는 필수 입력해야합니다.' })
  @IsString({ message: '활동이 시작 날짜는 문자열 형식이어야 합니다.' })
  start: string;

  @IsNotEmpty({ message: '활동이 끝난 날짜는 필수 입력해야합니다.' })
  @IsString({ message: '활동이 끝난 날짜는 문자열 형식이어야 합니다.' })
  end: string;

  @IsOptional()
  @IsString({ message: '제목은 문자열 형식이어야 합니다.' })
  impression: string;
}
