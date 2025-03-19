import { Base } from 'src/typeorm-entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class TransactionCategory extends Base {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  iconUrl: string;
}
