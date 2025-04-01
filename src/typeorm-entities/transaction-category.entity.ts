import { Base } from '../typeorm-entities/base.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { RecurringTransaction } from './recurring-transaction.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class TransactionCategory extends Base {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  iconUrl: string;

  @ManyToOne(() => TransactionCategory, (category) => category.childCategories)
  parentCategory: TransactionCategory;

  @OneToMany(() => TransactionCategory, (category) => category.parentCategory)
  childCategories: TransactionCategory[];

  @ManyToMany(() => Transaction)
  transactions: Transaction[];

  @ManyToMany(() => RecurringTransaction)
  recurringTransactions: RecurringTransaction[];
}
