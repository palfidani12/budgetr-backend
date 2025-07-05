import { Module } from '@nestjs/common';
import { MoneyPocketService } from './money-pocket.service';
import { MoneyPocketController } from './money-pocket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm-entities/user.entity';
import { MoneyPocket } from 'src/typeorm-entities/money-pocket.entity';
import { Transaction } from 'src/typeorm-entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MoneyPocket, User, Transaction])],
  controllers: [MoneyPocketController],
  providers: [MoneyPocketService],
})
export class MoneyPocketModule {}
