import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity('Activity')
export class ActivityEntity extends CommonEntity {
  @Column()
  title: string;

  @Column()
  dday: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  link: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  imageUrl: string;
}
