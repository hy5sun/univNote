import { registerEnumType } from '@nestjs/graphql';
import { IsDate, IsEmail, IsEnum, Matches } from 'class-validator';
import { Column, PrimaryColumn } from 'typeorm';

export enum Gender {
  Woman = 'Woman',
  Man = 'Man',
}

registerEnumType(Gender, { name: 'Gender' });

export class createUserDto {
  @PrimaryColumn({ unique: true })
  id: string;

  @IsEmail()
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_\-+=`|\(){}[\]:;"'<>,.?/])(?=.*[0-9]).{8,14}$/,
    {
      message: '특수문자를 포함하여 8~14자의 비밀번호를 써주세요.',
    },
  )
  password: string;

  @Column({ nullable: false })
  name: string;

  @IsEnum(Gender)
  @Column()
  gender: Gender;

  @Column({ nullable: false })
  univ: string;

  @Column({ nullable: false })
  department: string;

  @Column({ nullable: false })
  admissionDate: string;

  @Column({ nullable: false })
  expectedGraduationDate: string;
}
