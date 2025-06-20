import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/typeorm-entities/transaction.entity';
import { In, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { MoneyPocket } from 'src/typeorm-entities/money-pocket.entity';
import { TransactionCategory } from 'src/typeorm-entities/transaction-category.entity';

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
        currency: props.currency,
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
}
