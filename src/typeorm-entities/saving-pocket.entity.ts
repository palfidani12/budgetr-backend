import { Base } from 'src/typeorm-entities/base.entity';
import { Column, Entity } from 'typeorm';

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
}
