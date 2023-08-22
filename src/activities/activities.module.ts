import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from './entities/activity.entity';
import { ReviewEntity } from './entities/review.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forFeature([ActivityEntity, ReviewEntity]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
