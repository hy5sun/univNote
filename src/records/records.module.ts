import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordEntity } from './entities/record.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([RecordEntity])],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
