import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRecordDto: CreateRecordDto, @Req() req) {
    return this.recordsService.create(createRecordDto, req.email);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.recordsService.findAll(req.email);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.recordsService.findOne(id, req.email);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
    @Req() req,
  ) {
    return this.recordsService.update(id, updateRecordDto, req.email);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.recordsService.remove(id, req.email);
  }
}
