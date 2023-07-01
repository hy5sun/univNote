import {
  IsEmail,
  IsEnum,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { registerEnumType } from '@nestjs/graphql';

export enum Gender {
  Woman = 'Woman',
  Man = 'Man',
}

registerEnumType(Gender, { name: 'Gender' });

@Entity('User')
export class UserEntity {
  @PrimaryColumn({ unique: true })
  id: string;

  @IsEmail()
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_\-+=`|\(){}[\]:;"'<>,.?/])(?=.*[0-9]).{8,14}$/,
    {
      message: '영어, 숫자, 특수문자를 포함하여 8~14자의 비밀번호를 써주세요.',
    },
  )
  password: string;

  @Column({ nullable: false })
  @MinLength(2, {
    message: '2글자 이상 입력해야 합니다.',
  })
  @MaxLength(5, {
    message: '5글자 이하로 입력해야 합니다.',
  })
  name: string;

  @IsEnum(Gender)
  @Column({ nullable: false })
  gender: Gender;

  @Column({ nullable: false })
  univ: string;

  @Column({ nullable: false })
  @MinLength(3, {
    message: '3글자 이상 입력해야 합니다.',
  })
  @MaxLength(15, {
    message: '15글자 이하로 입력해야 합니다.',
  })
  department: string;

  @Column({ nullable: false })
  admissionDate: Date;

  @Column({ nullable: false })
  expectedGraduationDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  private beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
