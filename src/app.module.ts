import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CryptoPosession } from './typeorm-entities/crypto-posession.entity';
import { LoanPocket } from './typeorm-entities/loan-pocket.entity';
import { MoneyPocket } from './typeorm-entities/money-pocket.entity';
import { RecurringTransaction } from './typeorm-entities/recurring-transaction.entity';
import { SavingPocket } from './typeorm-entities/saving-pocket.entity';
import { StockPosession } from './typeorm-entities/stock-posession.entity';
import { TransactionCategory } from './typeorm-entities/transaction-category.entity';
import { Transaction } from './typeorm-entities/transaction.entity';
import { User } from './typeorm-entities/user.entity';
import { TransactionModule } from './transaction/transaction.module';
import { ScheduledTransactionsModule } from './scheduled-transactions/scheduled-transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Import .env
    // Import database connector
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '8080'),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        CryptoPosession,
        LoanPocket,
        MoneyPocket,
        RecurringTransaction,
        SavingPocket,
        StockPosession,
        TransactionCategory,
        Transaction,
        User,
      ],
      synchronize: true, // Should be false in production
    }),
    AuthModule,
    UserModule,
    TransactionModule,
    ScheduledTransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
