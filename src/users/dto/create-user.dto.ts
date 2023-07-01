import { registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsEnum, Matches } from 'class-validator';
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
  password: string;

  @Column({ nullable: false })
  name: string;

  @IsEnum(Gender)
  @Column({ nullable: false })
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
