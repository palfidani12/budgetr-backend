import { Base } from 'src/typeorm-entities/base.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { MoneyPocket } from './money-pocket.entity';
import { TransactionCategory } from './transaction-category.entity';

@Entity()
export class RecurringTransaction extends Base {
  @Column()
  amount: number;

  @Column()
  name: string;

  @Column()
  currency: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  frequency: string;

  @ManyToOne(
    () => MoneyPocket,
    (moneyPocket) => moneyPocket.recurringTransactions,
  )
  moneyPocket: MoneyPocket;

  @ManyToMany(() => TransactionCategory)
  @JoinTable()
  categories: TransactionCategory[];
}
