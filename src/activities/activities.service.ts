import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { v1 as uuid } from 'uuid';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ActivityEntity } from './entities/activity.entity';
import { UsersService } from 'src/users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(ActivityEntity)
    private activitiesRepository: Repository<ActivityEntity>,
  ) {}

  async showAll(type: string, page: number) {
    const [activities, total] = await this.activitiesRepository.findAndCount({
      where: { type: type },
      take: 10,
      skip: (page - 1) * 10,
      order: { createdAt: 'DESC' },
    });

    return {
      StatusCode: HttpStatus.OK,
      data: {
        message: ['정상적으로 전체 조회했습니다.'],
        activities,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / 10),
        },
      },
    };
  }

  async showBest(type: string) {
    const activities = await this.cacheManager.get(type);
    return {
      statusCode: HttpStatus.OK,
      data: {
        message: ['정상적으로 인기 공고를 조회했습니다.'],
        activities,
      },
    };
  }

  async showDetail(actId: string) {
    const activity = await this.activitiesRepository.findOne({
      where: { id: actId },
    });

    if (!activity) {
      throw new NotFoundException(['해당 아이디의 공고문을 찾을 수 없습니다.']);
    }

    console.log(activity);

    const url = `${process.env.PYTHON_IP}/reviews`;

    const response = await axios.get(url, {
      params: {
        keyword: activity.type === '동아리' ? activity.name : activity.title,
      },
    });

    const reviews = response.data;

    return {
      statusCode: HttpStatus.OK,
      data: {
        message: ['정상적으로 상세 조회를 했습니다.'],
        activity,
        reviews,
      },
    };
  }

  async showRecs(email: string) {
    const user = await this.userService.findByEmail(email);
    const activities = await this.cacheManager.get(user.email);

    return {
      statusCode: HttpStatus.OK,
      data: {
        message: ['정상적으로 추천 공고를 조회했습니다.'],
        activities,
      },
    };
  }

  async searchCA(type: string, keyword: string, page: number) {
    const [activities, total] = await this.activitiesRepository.findAndCount({
      where: { type: type, title: Like(`%${keyword}%`) },
      take: 10,
      skip: (page - 1) * 10,
      order: { createdAt: 'DESC' },
    });

    return {
      StatusCode: HttpStatus.OK,
      data: {
        message: ['정상적으로 검색했습니다.'],
        activities,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / 10),
        },
      },
    };
  }

  async saveRecs(email: string) {
    const user = await this.userService.findByEmail(email);

    const url = `${process.env.PYTHON_IP}/recommend`;
    const response = await axios.get(url, {
      params: {
        major: user.department,
      },
    });

    const data = response.data;
    const activities: Activity[] = [];

    const promises = data.map(async (item) => {
      const duplicated = await this.activitiesRepository.findOne({
        where: { link: item.link },
      });

      const activity: ActivityEntity = {
        id: uuid(),
        ...item,
        imageUrl: item.image_url || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      activities.push(activity);

      if (!duplicated) {
        await this.activitiesRepository.save(activity);
      }
    });

    await Promise.all(promises);

    await this.cacheManager.set(user.email, activities, 86400 * 1000);

    return {
      statusCode: HttpStatus.OK,
      data: {
        message: ['정상적으로 추천 공고 데이터를 저장했습니다.'],
      },
    };
  }

  async saveAllCA(type: string, idx?: number) {
    const url =
      type === '동아리'
        ? `${process.env.PYTHON_IP}/club`
        : type === '대외활동'
        ? `${process.env.PYTHON_IP}/activity`
        : `${process.env.PYTHON_IP}/contest`;

    const response = await axios.get(url, {
      params: {
        idx: idx,
      },
    });
    const data = response.data;

    const promises = data.map(async (item) => {
      const duplicated = await this.activitiesRepository.findOne({
        where: { link: item.link },
      });
      const activity: ActivityEntity = {
        id: uuid(),
        type: type,
        ...item,
        imageUrl: item.image_url || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (!duplicated) {
        await this.activitiesRepository.save(activity);
      }
    });

    await Promise.all(promises);

    return {
      statusCode: HttpStatus.OK,
      data: {
        message: [`정상적으로 ${type} 데이터가 저장됐습니다.`],
      },
    };
  }

  async saveBestCA(type: string) {
    await this.cacheManager.del(type);

    const url =
      type === '동아리'
        ? `${process.env.PYTHON_IP}/club/best`
        : type === '대외활동'
        ? `${process.env.PYTHON_IP}/activity/best`
        : `${process.env.PYTHON_IP}/contest/best`;
    const response = await axios.get(url);
    const data = response.data;

    const result: Activity[] = [];

    const promises = data.map(async (item) => {
      const duplicated = await this.activitiesRepository.findOne({
        where: { link: item.link },
      });
      const activity: ActivityEntity = {
        id: uuid(),
        type: type,
        ...item,
        imageUrl: item.image_url || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      result.push(activity);

      if (!duplicated) {
        await this.activitiesRepository.save(activity);
      }
    });

    await Promise.all(promises);

    await this.cacheManager.set(type, result, 86400 * 1000);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async save() {
    await this.activitiesRepository.clear();

    console.log('check check');
    await this.saveBestCA('동아리');
    await this.saveBestCA('대외활동');
    await this.saveBestCA('공모전');

    for (let i = 0; i < 5; i++) {
      await this.saveAllCA('동아리', i * 20);
      await this.saveAllCA('대외활동', i * 20);
      await this.saveAllCA('공모전', i * 20);
    }

    return {
      statusCode: HttpStatus.OK,
      data: {
        message: ['정상적으로 데이터를 저장했습니다.'],
      },
    };
  }
}

interface Activity {
  id: string;
  type: string;
  title: string;
  name: string;
  dday: string;
  link: string;
  imageUrl: string;
}
