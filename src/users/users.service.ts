import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  getUserRepository() {
    return this.usersRepository;
  }

  async createUser(createUserDto: createUserDto) {
    const now = new Date();
    const user = this.usersRepository.create({
      ...createUserDto,
      createdAt: now,
      updatedAt: now,
    });

    if (user.expectedGraduationDate < user.admissionDate) {
      throw new ConflictException(['졸업 예정일이 입학일 보다 빠릅니다.']);
    }

    await this.usersRepository.save(user);
  }

  async validate(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    console.log(user);

    if (user) {
      throw new ConflictException(['이미 존재하는 이메일입니다.']);
    } else {
      return true;
    }
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException([
        '해당 이메일을 가진 유저를 찾을 수 없습니다.',
      ]);
    }

    return user;
  }
}
