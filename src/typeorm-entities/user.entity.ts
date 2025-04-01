import { Base } from '../typeorm-entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { LoanPocket } from './loan-pocket.entity';
import { SavingPocket } from './saving-pocket.entity';
import { StockPosession } from './stock-posession.entity';
import { CryptoPosession } from './crypto-posession.entity';
import { MoneyPocket } from './money-pocket.entity';

@Entity()
export class User extends Base {
  @Column({ nullable: true })
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

  @OneToMany(() => LoanPocket, (loanPocket) => loanPocket.user)
  loanPockets: LoanPocket[];

  @OneToMany(() => SavingPocket, (savingPocket) => savingPocket.user)
  savingPockets: SavingPocket[];

  @OneToMany(() => StockPosession, (stockPosession) => stockPosession.user)
  stockPosessions: StockPosession[];

  @OneToMany(() => CryptoPosession, (cryptoPosession) => cryptoPosession.user)
  cryptoPosessions: CryptoPosession[];

  @OneToMany(() => MoneyPocket, (moneyPocket) => moneyPocket.user)
  moneyPockets: MoneyPocket[];
}
