import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  create() {
    return this.recordsService.create();
  }

  @Get()
  findAll(@Req() req) {
    return this.recordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.recordsService.update(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordsService.remove(id);
  }
}
