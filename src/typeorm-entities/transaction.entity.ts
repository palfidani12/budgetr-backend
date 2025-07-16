import { Base } from '../typeorm-entities/base.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { MoneyPocket } from './money-pocket.entity';
import { TransactionCategory } from './transaction-category.entity';

@Entity()
export class Transaction extends Base {
  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  name: string;

  @Column()
  vendorName: string;

  @Column({ type: 'timestamp' })
  transactionTime: string;

  @ManyToOne(() => MoneyPocket, (moneyPocket) => moneyPocket.transactions)
  moneyPocket: MoneyPocket;

  @ManyToMany(() => TransactionCategory)
  @JoinTable()
  categories: TransactionCategory[];
}
