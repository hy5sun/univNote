import {
  IsDate,
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity('User')
export class UserEntity extends CommonEntity {
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
    message: '이름은 2글자 이상 입력해야 합니다.',
  })
  @MaxLength(5, {
    message: '이름은 5글자 이하로 입력해야 합니다.',
  })
  name: string;

  @Column({ nullable: false })
  univ: string;

  @Column({ nullable: false })
  @MinLength(3, {
    message: '학과는 3글자 이상 입력해야 합니다.',
  })
  @MaxLength(15, {
    message: '학과는 15글자 이하로 입력해야 합니다.',
  })
  department: string;

  @IsDate()
  @Column({ nullable: false })
  admissionDate: Date;

  @IsDate()
  @Column({ nullable: false })
  expectedGraduationDate: Date;

  @BeforeInsert()
  private beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
