import { Base } from 'src/typeorm-entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class CryptoPosession extends Base {
  @Column()
  amount: number;

  @Column()
  cryptoName: string;

  @Column()
  cryptoSymbol: string;

  @Column()
  buyPrice: number;

  @Column()
  buyTime: string;

  @Column()
  sellPrice: number;

  @Column()
  sellTime: string;
}
