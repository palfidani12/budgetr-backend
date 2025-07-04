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
// import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('create')
  login(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: string) {
    return await this.transactionService.getTransationById(id);
  }

  @Patch(':id')
  updateTransaction(
    @Param('id') id: string,
    // @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    // const updateResult = await this.userService.updateUser(id, updateUserDto);
    return `updateResult ${id}`;
  }

  @Delete(':id')
  async removeTransaction(@Param('id') id: string) {
    return await this.transactionService.deleteTransaction(id);
  }
}
