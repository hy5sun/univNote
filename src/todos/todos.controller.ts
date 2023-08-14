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
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req) {
    return this.todosService.create(createTodoDto, req.userEmail);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.todosService.findAll(req.userEmail);
  }

  @UseGuards(AuthGuard)
  @Get(':year')
  findByYear(@Param('year') year: string, @Req() req) {
    return this.todosService.findByYear(year, req.userEmail);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req,
  ) {
    return this.todosService.update(id, updateTodoDto, req.userEmail);
  }

  @UseGuards(AuthGuard)
  @Patch('check/:id')
  check(@Param('id') id: string, @Req() req) {
    return this.todosService.changeCheckStatus(id, req.userEmail);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.todosService.remove(id, req.userEmail);
  }
}
