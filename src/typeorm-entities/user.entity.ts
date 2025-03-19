import { Base } from 'src/typeorm-entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends Base {
  @Column()
  nickName: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  country: string;
}
