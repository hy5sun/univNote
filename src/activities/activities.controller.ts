import { Controller, Get, Query, Param, UseGuards, Req } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('/best')
  showBestCA(@Query('type') type: string) {
    const decodedType = decodeURIComponent(type);
    return this.activitiesService.showBest(decodedType);
  }

  @Get()
  showAll(@Query('type') type: string, @Query('page') page: number) {
    const decodedType = decodeURIComponent(type);
    return this.activitiesService.showAll(decodedType, page);
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
    const decodedType = decodeURIComponent(type);
    const decodedKeyword = decodeURIComponent(keyword);
    return this.activitiesService.searchCA(decodedType, decodedKeyword, page);
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
