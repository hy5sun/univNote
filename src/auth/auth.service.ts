import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/signUp.dto';
import { EmailService } from 'src/email/email.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    await this.usersService.createUser(signUpDto);
    const user = await this.usersService.findByEmail(signUpDto.email);

    return {
      statusCode: HttpStatus.CREATED,
      data: user,
    };
  }

  async send(email: string) {
    await this.usersService.validate(email);

    const code = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    try {
      await this.emailService.send(email, +code);
      await this.cacheManager.set(email, code, 300 * 1000);
      return {
        statusCode: HttpStatus.CREATED,
        message: ['이메일을 전송했습니다.'],
      };
    } catch (e) {
      throw new InternalServerErrorException([
        '이메일 전송에 문제가 생겼습니다.',
      ]);
    }
  }
}
