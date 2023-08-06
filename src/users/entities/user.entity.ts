import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CommonEntity } from 'src/common/entities/common.entity';
import { RecordEntity } from 'src/records/entities/record.entity';

@Entity('User')
export class UserEntity extends CommonEntity {
  @Column({ unique: true, nullable: false })
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
  admissionDate: Date;

  @Column({ nullable: false })
  expectedGraduationDate: Date;

  @OneToMany(() => RecordEntity, (record) => record.author)
  records: RecordEntity[];

  @BeforeInsert()
  private beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
