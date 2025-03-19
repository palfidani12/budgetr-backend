import { Base } from 'src/typeorm-entities/base.entity';
import { Column, Entity } from 'typeorm';

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

  @Column()
  transactionTime: string;
}
