import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/typeorm-entities/transaction.entity';
import { MoneyPocket } from 'src/typeorm-entities/money-pocket.entity';
import { TransactionCategory } from 'src/typeorm-entities/transaction-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TypeOrmModule.forFeature([MoneyPocket]),
    TypeOrmModule.forFeature([TransactionCategory]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
