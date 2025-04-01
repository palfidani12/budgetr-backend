import { Base } from '../typeorm-entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class CryptoPosession extends Base {
  @Column()
  amount: number;

  @Column()
  cryptoName: string;

  @Column()
  cryptoSymbol: string;

  @Column()
  buyPrice: number;

  @Column()
  buyTime: string;

  @Column()
  sellPrice: number;

  @Column()
  sellTime: string;

  @ManyToOne(() => User, (user) => user.cryptoPosessions)
  user: User;
}
