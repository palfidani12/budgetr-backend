import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/typeorm-entities/transaction.entity';
import { In, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { MoneyPocket } from 'src/typeorm-entities/money-pocket.entity';
import { TransactionCategory } from 'src/typeorm-entities/transaction-category.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(MoneyPocket)
    private moneyPocketRepository: Repository<MoneyPocket>,
    @InjectRepository(TransactionCategory)
    private categoriesRepository: Repository<TransactionCategory>,
  ) {}

  async createTransaction(props: CreateTransactionDto) {
    // creating a transaction should update the pocket balance
    let moneyPocket: MoneyPocket | null;
    let transactionCategories: TransactionCategory[];

    try {
      moneyPocket = await this.moneyPocketRepository.findOneBy({
        id: props.moneyPocketId,
      });

      transactionCategories = await this.categoriesRepository.find({
        where: {
          id: In(props.categoryIds ?? []),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while retrieving related fields',
      );
    }

    if (!moneyPocket) {
      throw new BadRequestException('Money pocket not found with given id');
    }

    try {
      const transaction = this.transactionRepository.create({
        amount: props.amount,
        currency: moneyPocket.currency,
        name: props.transactionName,
        vendorName: props.vendorName,
        transactionTime: props.transactionTime,
        moneyPocket: moneyPocket,
        categories: transactionCategories,
      });
      const savedTransaction =
        await this.transactionRepository.save(transaction);
      return savedTransaction;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while creating transaction',
      );
    }
  }

  async getTransactionById(id: string) {
    let transaction: Transaction | null;
    try {
      transaction = await this.transactionRepository.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to retrieve transaction',
      );
    }

    if (!transaction) {
      throw new NotFoundException('Transaction with given id not found');
    }

    return transaction;
  }

  async getTransactions() {
    let transactions: Transaction[] | null;
    try {
      transactions = await this.transactionRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to retrieve transaction',
      );
    }

    if (!transactions) {
      throw new NotFoundException('Transaction with given id not found');
    }

    return transactions;
  }

  async updateTransaction(
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = await this.getTransactionById(transactionId);
    if (updateTransactionDto.amount) {
      transaction.amount = updateTransactionDto.amount;
    }
    if (updateTransactionDto.transactionName) {
      transaction.name = updateTransactionDto.transactionName;
    }
    if (updateTransactionDto.vendorName) {
      transaction.vendorName = updateTransactionDto.vendorName;
    }
    if (updateTransactionDto.transactionTime) {
      transaction.transactionTime = updateTransactionDto.transactionTime;
    }

    return await this.transactionRepository.save(transaction);
  }

  async deleteTransaction(id: string) {
    const transactionToRemove = await this.getTransactionById(id);

    try {
      const removedTransaction =
        await this.transactionRepository.softRemove(transactionToRemove);
      return removedTransaction;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to delete transaction',
      );
    }
  }
}
