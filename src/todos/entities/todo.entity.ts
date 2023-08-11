import { CommonEntity } from 'src/common/entities/common.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('Todo')
export class TodoEntity extends CommonEntity {
  @Column({ nullable: false })
  year: string;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  isChecked: boolean;

  @Column()
  authorEmail: string;

  @ManyToOne(() => UserEntity, (user) => user.todos)
  @JoinColumn({ name: 'authorEmail' })
  author: UserEntity;
}
