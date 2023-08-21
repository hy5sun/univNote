import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ReviewEntity } from './review.entity';

@Entity('Activity')
export class ActivityEntity extends CommonEntity {
  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  dday: string;

  @Column()
  link: string;

  @Column()
  actType: string;

  @Column({ nullable: true })
  company: string;

  @OneToMany(() => ReviewEntity, (review) => review.act)
  reviews: ReviewEntity[];
}
