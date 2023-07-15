import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { VerifyEmailCodeDto } from './dto/verify-code.dto';
import { LogInDto } from './dto/login.dto';

@Controller('auth')
@UseInterceptors(CacheInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('send-verify-email')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.authService.send(sendEmailDto.email);
  }

  @Post('verify-email-code')
  async getEmailCode(@Body() verifyEmailCodeDto: VerifyEmailCodeDto) {
    return this.authService.verifyCode(
      verifyEmailCodeDto.email,
      verifyEmailCodeDto.code,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LogInDto) {
    return this.authService.login(loginDto);
  }
}
