import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ReviewEntity } from './review.entity';

@Entity('Activity')
export class ActivityEntity extends CommonEntity {
  @Column()
  title: string;

  @Column()
  dday: string;

  @Column({ unique: true })
  link: string;

  @Column({ nullable: true })
  actType: string;

  @Column({ nullable: true })
  company: string;

  @OneToMany(() => ReviewEntity, (review) => review.activity)
  reviews: ReviewEntity[];
}
