import { Controller, Patch, UseGuards, Req, Body } from '@nestjs/common';
import { DatesService } from './dates.service';
import { UpdateDateDto } from './dto/update-date.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('dates')
export class DatesController {
  constructor(private readonly datesService: DatesService) {}

  @UseGuards(AuthGuard)
  @Patch('/graduate')
  updateGraduationDate(@Body() updateDateDto: UpdateDateDto, @Req() req) {
    return this.datesService.updateGraduationDate(updateDateDto, req.userEmail);
  }

  @UseGuards(AuthGuard)
  @Patch('/schedule')
  updateScheduleDate(@Body() updateDateDto: UpdateDateDto, @Req() req) {
    return this.datesService.updateExpScheduleDate(
      updateDateDto,
      req.userEmail,
    );
  }
}
