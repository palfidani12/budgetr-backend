import { Base } from 'src/typeorm-entities/base.entity';
import { Column, Entity } from 'typeorm';

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
}
