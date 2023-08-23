import { Controller, Get, Query, Param, UseGuards, Req } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('/best')
  showBestCA(@Query('type') type: string) {
    return this.activitiesService.showBest(type);
  }

  @Get()
  showAll(@Query('type') type: string, @Query('page') page: number) {
    return this.activitiesService.showAll(type, page);
  }

  @Get('detail/:id')
  showDetail(@Param('id') id: string) {
    return this.activitiesService.showDetail(id);
  }

  @UseGuards(AuthGuard)
  @Get('/recommend')
  showRecs(@Req() req) {
    return this.activitiesService.showRecs(req.userEmail);
  }

  @Get('/search')
  searchCA(
    @Query('type') type: string,
    @Query('page') page: number,
    @Query('keyword') keyword: string,
  ) {
    return this.activitiesService.searchCA(type, keyword, page);
  }

  @UseGuards(AuthGuard)
  @Get('/recommend/save')
  saveRecs(@Req() req) {
    return this.activitiesService.saveRecs(req.userEmail);
  }

  @Get('/save')
  save() {
    return this.activitiesService.save();
  }
}
