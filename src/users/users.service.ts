import { ConflictException, Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { createUserDto } from './dto/create-user.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
  ) {}

  async createUser(createUserDto: createUserDto) {
    const now = new Date();
    const user = new UserEntity();

    user.id = uuid();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.name = createUserDto.name;
    user.univ = createUserDto.univ;
    user.department = createUserDto.department;
    user.admissionDate = new Date(createUserDto.admissionDate);
    user.expectedGraduationDate = new Date(
      createUserDto.expectedGraduationDate,
    );
    user.createdAt = now;
    user.updatedAt = now;

    await this.validate(user);

    try {
      this.sendEmail(user.email);
      await this.usersRepository.save(user);
    } catch (e) {
      console.log(e);
    }
  }

  async validate(user: UserEntity) {
    if (user.expectedGraduationDate < user.admissionDate) {
      throw new ConflictException(['졸업 예정일이 입학일 보다 빠릅니다.']);
    }
  }

  async sendEmail(email: string) {
    const emailDuplicationUser = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (emailDuplicationUser) {
      throw new ConflictException(['이미 존재하는 이메일입니다.']);
    }

    await this.emailService.send(email);
  }

  async findByEmail(email: string) {
    const user = this.usersRepository.findOne({
      where: { email: email },
    });

    return {
      email: (await user).email,
      createdAt: (await user).createdAt,
      updatedAt: (await user).updatedAt,
    };
  }
}
