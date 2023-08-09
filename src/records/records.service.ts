import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v1 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { UsersService } from 'src/users/users.service';
import { RecordEntity } from './entities/record.entity';

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

    const record = this.recordsRepository.create({
      id: uuid(),
      author: user,
      ...createRecordDto,
      createdAt: now,
      updatedAt: now,
    });

    await this.recordsRepository.save(record);
    return {
      statusCode: HttpStatus.CREATED,
      data: {
        message: ['기록 게시물이 정상적으로 생성되었습니다.'],
        id: record.id,
        title: record.title,
        author: record.author.email,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
    };
  }

  async findAll(authorEmail: string) {
    const user = await this.usersService.findByEmail(authorEmail);
    const post = await this.recordsRepository.find({
      where: { author: user },
    });

    if (!post) {
      throw new NotFoundException([
        `${user.name}님이 작성한 게시물이 존재하지 않습니다.`,
      ]);
    }

    return {
      statusCode: HttpStatus.OK,
      data: post,
    };
  }

  async findOne(postId: string, authorEmail: string) {
    const user = await this.usersService.findByEmail(authorEmail);
    const post = await this.recordsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException([`id가 ${postId}인 게시물이 없습니다`]);
    }

    if (post.authorEmail !== user.email) {
      throw new UnauthorizedException(['접근할 권한이 없습니다.']);
    }

    return {
      statusCode: HttpStatus.OK,
      data: {
        message: ['게시물을 정상적으로 조회하였습니다.'],
        post,
      },
    };
  }

  async update(
    postId: string,
    updateRecordDto: UpdateRecordDto,
    authorEmail: string,
  ) {
    const user = await this.usersService.findByEmail(authorEmail);
    const post = await this.recordsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException([`id가 ${postId}인 게시물이 없습니다.`]);
    }

    if (post.authorEmail !== user.email) {
      throw new UnauthorizedException(['접근할 권한이 없습니다.']);
    }

    post.category = updateRecordDto.category;
    post.title = updateRecordDto.title;
    post.content = updateRecordDto.content;
    post.impression = updateRecordDto.impression;
    post.start = updateRecordDto.start;
    post.end = updateRecordDto.end;

    await this.recordsRepository.save(post);

    return {
      statusCode: HttpStatus.OK,
      data: {
        message: ['게시물을 정상적으로 수정했습니다.'],
        author: user.email,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    };
  }

  async remove(postId: string, authorEmail: string) {
    const user = await this.usersService.findByEmail(authorEmail);
    const post = await this.recordsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException([`id가 ${postId}인 게시물이 없습니다.`]);
    }

    if (post.authorEmail !== user.email) {
      throw new UnauthorizedException(['접근할 권한이 없습니다.']);
    }

    await this.recordsRepository.delete({ id: postId });

    return {
      statusCode: HttpStatus.OK,
      data: {
        message: ['게시물이 정상적으로 삭제되었습니다.'],
        deletedAt: post.deletedAt,
      },
    };
  }
}
