import { ConflictException, Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { createUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: createUserDto) {
    const now = new Date();
    const user = new UserEntity();

    user.id = uuid();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.name = createUserDto.name;
    user.gender = createUserDto.gender;
    user.univ = createUserDto.univ;
    user.department = createUserDto.department;
    user.admissionDate = createUserDto.admissionDate;
    user.expectedGraduationDate = createUserDto.expectedGraduationDate;
    user.createdAt = now;
    user.updatedAt = now;

    await this.validate(user);

    await this.usersRepository.save(user);
  }

  async validate(user: UserEntity) {
    const emailDuplicationUser = await this.usersRepository.findOne({
      where: { email: user.email },
    });

    if (emailDuplicationUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
  }

  async findByEmail(email: string) {
    const user = this.usersRepository.findOne({
      where: { email: email },
    });

    return user;
  }
}
