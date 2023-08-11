import { IntersectionType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends IntersectionType(CreateTodoDto) {}
