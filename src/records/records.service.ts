import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RecordEntity } from './entities/record.entity';
import { v1 as uuid } from 'uuid';
import { Repository } from 'typeorm';

@Injectable()
export class RecordsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(RecordEntity)
    private recordsRepository: Repository<RecordEntity>,
  ) {}

  async create(createRecordDto: CreateRecordDto, writerEmail: string) {
    const user = await this.usersService.findByEmail(writerEmail);

    const now = new Date();
    const record = new RecordEntity();

    record.id = uuid();
    record.author = user;
    record.category = createRecordDto.category;
    record.title = createRecordDto.title;
    record.content = createRecordDto.content;
    record.impression = createRecordDto.impression;
    record.start = new Date(createRecordDto.start);
    record.end = new Date(createRecordDto.end);
    record.createdAt = now;
    record.updatedAt = now;

    try {
      await this.recordsRepository.save(record);
    } catch (e) {
      throw new InternalServerErrorException([
        '게시물 생성에 문제가 생겼습니다.',
      ]);
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: ['기록 게시물이 정상적으로 생성되었습니다.'],
      data: {
        title: record.title,
        author: record.author.email,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
    };
  }

  async findAll(authorEmail: string) {
    const user = await this.usersService.findByEmail(authorEmail);

    return {
      statusCode: HttpStatus.OK,
      data: await this.recordsRepository.find({
        where: { author: user },
      }),
    };
  }

  async findOne(postId: string, authorEmail: string) {
    const user = await this.usersService.findByEmail(authorEmail);

    try {
      return {
        statusCode: HttpStatus.OK,
        data: await this.recordsRepository.find({
          where: { author: user, id: postId },
        }),
      };
    } catch (e) {
      throw new InternalServerErrorException([
        '게시물 조회에 문제가 생겼습니다.',
      ]);
    }
  }

  async update(postId: string) {
    return `This action updates a #${postId} record`;
  }

  async remove(postId: string) {
    return `This action removes a #${postId} record`;
  }
}
