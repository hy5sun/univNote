import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ActivityEntity } from './activity.entity';

@Entity('Review')
export class ReviewEntity extends CommonEntity {
  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  date: string;

  @Column({ unique: true })
  link: string;

  @ManyToOne(() => ActivityEntity, (activity) => activity.reviews)
  @JoinColumn({ name: 'actId' })
  activity: ActivityEntity;
}
