import { Base } from '../typeorm-entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class StockPosession extends Base {
  @Column()
  amount: number;

  @Column()
  stockName: string;

  @Column()
  stockSymbol: string;

  @Column()
  buyPrice: number;

  @Column()
  buyTime: string;

  @Column()
  sellPrice: number;

  @Column()
  sellTime: string;

  @ManyToOne(() => User, (user) => user.stockPosessions)
  user: User;
}
