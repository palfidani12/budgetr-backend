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

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('create')
  login(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get()
  getTransaction() {
    return undefined;
  }

  @Get(':id')
  getTransactionById(@Param('id') id: string) {
    return id;
  }

  @Patch(':id')
  updateTransaction(
    @Param('id') id: string,
    // @Body() updateUserDto: UpdateUserDto,
  ) {
    // const updateResult = await this.userService.updateUser(id, updateUserDto);
    return `updateResult ${id}`;
  }

  @Delete(':id')
  removeTransaction(@Param('id') id: string) {
    // const deletedUser = await this.userService.removeUser(id);
    return { deletedUser: id };
  }
}
