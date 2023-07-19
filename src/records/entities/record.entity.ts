import { registerEnumType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum Category {
  onCampusAct = '교내활동',
  extraAct = '교외활동',
  volunteer = '봉사활동',
  certificate = '자격증',
  etc = '기타',
}

registerEnumType(Category, { name: 'Category' });

@Entity('Record')
export class RecordEntity extends CommonEntity {
  // TODO : Category Entity를 따로 만들어야하나?

  @Column({ nullable: false })
  category: Category;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  start: Date;

  @Column({ nullable: false })
  end: Date;

  @Column({ nullable: true })
  impression: string;

  @ManyToOne(() => UserEntity, (user) => user.records)
  author: UserEntity;
}
