import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(signUpDto: SignUpDto) {
    await this.usersService.createUser(signUpDto);
    const user = await this.usersService.findByEmail(signUpDto.email);

    return {
      statusCode: HttpStatus.CREATED,
      data: user,
    };
  }
}
