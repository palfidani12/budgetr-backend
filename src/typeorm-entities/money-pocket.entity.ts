import { Base } from '../typeorm-entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { RecurringTransaction } from './recurring-transaction.entity';

@Entity()
export class MoneyPocket extends Base {
  @Column()
  balance: number;

  @Column()
  currency: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  iconUrl: string;

  @ManyToOne(() => User, (user) => user.moneyPockets)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.moneyPocket)
  transactions: Transaction[];

  @OneToMany(
    () => RecurringTransaction,
    (recurringTransaction) => recurringTransaction.moneyPocket,
  )
  recurringTransactions: RecurringTransaction[];
}
