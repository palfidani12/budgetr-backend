import { Module } from '@nestjs/common';
import { ScheduledTransactionsService } from './scheduled-transactions.service';
import { ScheduledTransactionsController } from './scheduled-transactions.controller';

@Module({
  controllers: [ScheduledTransactionsController],
  providers: [ScheduledTransactionsService],
})
export class ScheduledTransactionsModule {}
