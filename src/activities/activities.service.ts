import { HttpStatus, Inject, Injectable } from '@nestjs/common';
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
    const [data, total] = await this.activitiesRepository.findAndCount({
      where: { actType: type },
      take: 10,
      skip: (page - 1) * 10,
      order: { createdAt: 'DESC' },
    });

    return {
      StatusCode: HttpStatus.OK,
      data: {
        message: ['정상적으로 전체 조회했습니다.'],
        data,
        lastPage: Math.ceil(total / 10),
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

    const url = 'http://주소';
    const response = await axios.get(url, {
      params: {
        keyword: activity.title,
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

  async searchCA(actType: string, keyword: string, page: number) {
    const [filteredData, total] = await this.activitiesRepository.findAndCount({
      where: { actType: actType, title: Like(`%${keyword}%`) },
      take: 10,
      skip: (page - 1) * 10,
      order: { createdAt: 'DESC' },
    });

    return {
      StatusCode: HttpStatus.OK,
      data: {
        message: ['정상적으로 검색했습니다.'],
        filteredData,
        lastPage: Math.ceil(total / 10),
      },
    };
  }

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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async save() {
    this.activitiesRepository.clear();

    console.log('check check');
    this.saveBestCA('동아리');
    this.saveBestCA('대외활동');
    this.saveBestCA('공모전');

    for (let i = 0; i < 5; i++) {
      this.saveAllCA('동아리', i * 20);
      this.saveAllCA('대외활동', i * 20);
      this.saveAllCA('공모전', i * 20);
    }
  }
}

interface Activity {
  id: string;
  actType: string;
  title: string;
  dday: string;
  company: string;
  link: string;
}
