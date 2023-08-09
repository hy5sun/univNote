import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v1 as uuid } from 'uuid';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UsersService } from 'src/users/users.service';
import { TodoEntity } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(TodoEntity)
    private todoListsRepository: Repository<TodoEntity>,
  ) {}

  async create(createTodoDto: CreateTodoDto, writerEmail: string) {
    const user = await this.usersService.findByEmail(writerEmail);
    const now = new Date();

    const todo = this.todoListsRepository.create({
      ...createTodoDto,
      id: uuid(),
      isChecked: false,
      author: user,
      createdAt: now,
      updatedAt: now,
    });

    await this.todoListsRepository.save(todo);

    delete todo.author;
    delete todo.deletedAt;

    return {
      statusCode: HttpStatus.CREATED,
      data: {
        message: ['목표가 정상적으로 생성되었습니다.'],
        todo,
      },
    };
  }

  findAll() {
    return `This action returns all todos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
