import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async findAll(loginEmail: string) {
    const user = await this.usersService.findByEmail(loginEmail);
    const todolist = await this.todoListsRepository.find({
      where: { authorEmail: user.email },
      order: {
        createdAt: 'ASC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: {
        message: ['정상적으로 목표를 조회했습니다.'],
        todolist,
      },
    };
  }

  async findOne(todoId: string, loginEmail: string) {
    const user = await this.usersService.findByEmail(loginEmail);
    let todo;

    try {
      todo = await this.todoListsRepository.findOneOrFail({
        where: { id: todoId },
      });
    } catch (e) {
      throw new NotFoundException(['해당 아이디의 목표가 존재하지 않습니다.']);
    }

    if (todo.authorEmail !== user.email) {
      throw new UnauthorizedException(['접근할 권한이 없습니다.']);
    }

    return {
      statusCode: HttpStatus.OK,
      data: {
        message: [`정상적으로 id가 ${todoId}인 목표를 조회했습니다.`],
        todo,
      },
    };
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
