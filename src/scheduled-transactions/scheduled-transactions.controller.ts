import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduledTransactionsService } from './scheduled-transactions.service';
import { CreateScheduledTransactionDto } from './dto/create-scheduled-transaction.dto';
import { UpdateScheduledTransactionDto } from './dto/update-scheduled-transaction.dto';

@Controller('scheduled-transactions')
export class ScheduledTransactionsController {
  constructor(private readonly scheduledTransactionsService: ScheduledTransactionsService) {}

  @Post()
  create(@Body() createScheduledTransactionDto: CreateScheduledTransactionDto) {
    return this.scheduledTransactionsService.create(createScheduledTransactionDto);
  }

  @Get()
  findAll() {
    return this.scheduledTransactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduledTransactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduledTransactionDto: UpdateScheduledTransactionDto) {
    return this.scheduledTransactionsService.update(+id, updateScheduledTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduledTransactionsService.remove(+id);
  }
}
