import { Base } from '../typeorm-entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class SavingPocket extends Base {
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

  @Column()
  goalBalance: number;

  @Column()
  goalSetDeadline: string;

  @ManyToOne(() => User, (user) => user.savingPockets)
  user: User;
}
