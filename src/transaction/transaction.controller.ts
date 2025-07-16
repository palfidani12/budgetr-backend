import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('create')
  login(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get()
  async getTransactions() {
    return await this.transactionService.getTransactions();
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: string) {
    return await this.transactionService.getTransactionById(id);
  }

  @Patch(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const updateResult = await this.transactionService.updateTransaction(
      id,
      updateTransactionDto,
    );
    return updateResult;
  }

  @Delete(':id')
  async removeTransaction(@Param('id') id: string) {
    return await this.transactionService.deleteTransaction(id);
  }
}
