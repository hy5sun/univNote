import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(AuthGuard)
  @Get('/recommend/save')
  saveRecs(@Req() req) {
    return this.activitiesService.saveRecs(req.userEmail);
  }
}
