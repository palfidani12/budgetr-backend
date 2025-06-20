import { Injectable } from '@nestjs/common';
import { CreateScheduledTransactionDto } from './dto/create-scheduled-transaction.dto';
import { UpdateScheduledTransactionDto } from './dto/update-scheduled-transaction.dto';

@Injectable()
export class ScheduledTransactionsService {
  create(createScheduledTransactionDto: CreateScheduledTransactionDto) {
    return 'This action adds a new scheduledTransaction';
  }

  findAll() {
    return `This action returns all scheduledTransactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduledTransaction`;
  }

  update(id: number, updateScheduledTransactionDto: UpdateScheduledTransactionDto) {
    return `This action updates a #${id} scheduledTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduledTransaction`;
  }
}
