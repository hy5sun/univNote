import { IsDate, IsEmail, IsEnum, Matches } from 'class-validator';
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
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: '특수문자는 사용할 수 없습니다.',
  })
  department: string;

  @Column({ nullable: false })
  admissionDate: string;

  @Column({ nullable: false })
  expectedGraduationDate: string;

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
