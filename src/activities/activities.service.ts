import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { v1 as uuid } from 'uuid';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityEntity } from './entities/activity.entity';
import { ReviewEntity } from './entities/review.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(ActivityEntity)
    private activitiesRepository: Repository<ActivityEntity>,
    @InjectRepository(ReviewEntity)
    private reviewsRepository: Repository<ReviewEntity>,
  ) {}

  async saveRecs(email: string) {
    const user = await this.userService.findByEmail(email);

    const url = '';
    const response = await axios.get(url, {
      params: {
        major: user.department,
      },
    });

    const data = response.data;
    const activities: Activity[] = [];

    data.map(async function (item) {
      const act = {
        id: uuid(),
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      activities.push(act);
      await this.activitiesRepository.save(act);
    });

    await this.cacheManager.set(user.email, activities, 86400 * 1000);

    return {
      statusCode: HttpStatus.OK,
      data: {
        message: ['정상적으로 추천 공고 데이터를 저장했습니다.'],
      },
    };
  }

  async saveAllCA(type: string, idx: number) {
    const url =
      type === '동아리'
        ? 'http://주소'
        : type === '대외활동'
        ? 'http://주소'
        : 'http://주소';

    const response = await axios.get(url, {
      params: {
        idx: idx,
      },
    });
    const data = response.data;

    data.map(async function name(item) {
      const act = {
        id: uuid(),
        actType: type,
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.activitiesRepository.save(act);
    });

    return response.data;
  }

  async saveBestCA(type: string) {
    await this.cacheManager.del(type);

    const url =
      type === '동아리'
        ? 'http://주소'
        : type === '대외활동'
        ? 'http://주소'
        : 'http://주소';
    const response = await axios.get(url);
    const data = response.data;

    const result: Activity[] = [];

    data.map(async function (item) {
      const act: ActivityEntity = {
        id: uuid(),
        actType: type,
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      result.push(act);
      await this.activitiesRepository.save(act);
    });

    await this.cacheManager.set(type, result, 86400 * 1000);
  }

  async saveReviews(actId: string) {
    console.log('Function Active');

    const url = 'http://주소';
    const act = await this.activitiesRepository.findOne({
      where: { id: actId },
    });

    const response = await axios.get(url, {
      params: {
        keyword: act.title,
      },
    });
    const data = response.data;

    const review: ReviewEntity = {
      id: uuid(),
      ...data,
    };

    await this.reviewsRepository.save(review);

    return response.data;
  }
}

interface Activity {
  id: string;
  actType: string;
  title: string;
  name: string;
  dday: string;
  company: string;
  link: string;
}
