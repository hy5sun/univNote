import { Injectable } from '@nestjs/common';

@Injectable()
export class RecordsService {
  async create() {
    return `This action creates a record`;
  }

  async findAll() {
    return `This action finds a record`;
  }

  async findOne(postId: string) {
    return `This action finds a #${postId} record`;
  }

  async update(postId: string) {
    return `This action updates a #${postId} record`;
  }

  async remove(postId: string) {
    return `This action removes a #${postId} record`;
  }
}
