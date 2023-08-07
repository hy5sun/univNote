import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RecordEntity } from 'src/records/entities/record.entity';

@Entity('User')
export class UserEntity {
  @PrimaryColumn({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  univ: string;

  @Column({ nullable: false })
  department: string;

  @Column({ nullable: false })
  admissionDate: string;

  @Column({ nullable: false })
  expectedGraduationDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => RecordEntity, (record) => record.author)
  records: RecordEntity[];

  @BeforeInsert()
  private beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
