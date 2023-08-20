import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import { UpdateDateDto } from './dto/update-date.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatesService {
  constructor(private readonly usersService: UsersService) {}

  usersRepository = this.usersService.getUserRepository();

  async updateGraduationDate(updateDateDto: UpdateDateDto, userEmail: string) {
    const user = await this.usersService.findByEmail(userEmail);

    if (updateDateDto.schedule === '졸업') {
      user.expectedGraduationDate = updateDateDto.updateDate;
      user.updatedAt = new Date();

      this.usersRepository.save(user);

      return {
        statusCode: HttpStatus.OK,
        data: {
          message: ['졸업 예정 날짜를 수정했습니다,'],
          updateDate: user.expectedGraduationDate,
        },
      };
    } else {
      throw new BadRequestException(['졸업을 입력해야 합니다.']);
    }
  }

  async updateExpScheduleDate(updateDateDto: UpdateDateDto, userEmail: string) {
    const user = await this.usersService.findByEmail(userEmail);

    if (
      updateDateDto.schedule === '개강' ||
      updateDateDto.schedule === '종강'
    ) {
      user.schedule = updateDateDto.schedule;
      user.expectedScheduleDate = updateDateDto.updateDate;
      user.updatedAt = new Date();

      this.usersRepository.save(user);

      return {
        statusCode: HttpStatus.OK,
        data: {
          message: ['학교 일정 날짜를 수정했습니다.'],
          schedule: user.schedule,
          expScheduleDate: user.expectedScheduleDate,
        },
      };
    } else {
      throw new BadRequestException(['개강 혹은 종강으로 입력해야 합니다.']);
    }
  }
}
