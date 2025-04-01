import { Base } from '../typeorm-entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class LoanPocket extends Base {
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

  @Column()
  totalLoanAmount: number;

  @ManyToOne(() => User, (user) => user.loanPockets)
  user: User;
}
