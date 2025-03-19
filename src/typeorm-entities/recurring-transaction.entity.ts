import { Base } from 'src/typeorm-entities/base.entity';
import { Column, Entity } from 'typeorm';

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
}
