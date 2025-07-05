import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMoneyPocketDto } from './dto/create-money-pocket.dto';
import { UpdateMoneyPocketDto } from './dto/update-money-pocket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoneyPocket } from 'src/typeorm-entities/money-pocket.entity';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm-entities/user.entity';
import { Transaction } from 'src/typeorm-entities/transaction.entity';

@Injectable()
export class MoneyPocketService {
  constructor(
    @InjectRepository(MoneyPocket)
    private moneyPocketRepository: Repository<MoneyPocket>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  async create(createMoneyPocketDto: CreateMoneyPocketDto) {
    let user: User | null;
    try {
      user = await this.userRepository.findOneBy({
        id: createMoneyPocketDto.userId,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while retrieving the user',
      );
    }

    if (!user) {
      throw new NotFoundException('User with userId not found');
    }

    try {
      const moneyPocket = this.moneyPocketRepository.create({
        balance: createMoneyPocketDto.startBalance,
        currency: createMoneyPocketDto.currency,
        name: createMoneyPocketDto.pocketName,
        type: createMoneyPocketDto.pocketType,
        iconUrl: createMoneyPocketDto.iconUrl,
        user,
      });

      const savedMoneyPocket =
        await this.moneyPocketRepository.save(moneyPocket);

      return savedMoneyPocket;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while creating pocket',
      );
    }
  }

  async findOne(id: string) {
    let moneyPocket: MoneyPocket | null;
    try {
      moneyPocket = await this.moneyPocketRepository.findOne({
        where: { id },
        relations: ['transactions', 'recurringTransactions'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while retrieving pocket',
      );
    }
    if (!moneyPocket) {
      throw new NotFoundException('Pocket not found');
    }

    return moneyPocket;
  }

  async update(id: string, updateMoneyPocketDto: UpdateMoneyPocketDto) {
    const moneyPocket = await this.findOne(id);
    if (updateMoneyPocketDto.iconUrl) {
      moneyPocket.iconUrl = updateMoneyPocketDto.iconUrl;
    }
    if (updateMoneyPocketDto.pocketName) {
      moneyPocket.name = updateMoneyPocketDto.pocketName;
    }
    if (updateMoneyPocketDto.pocketType) {
      moneyPocket.type = updateMoneyPocketDto.pocketType;
    }
    if (updateMoneyPocketDto.updatedBalance) {
      try {
        const now = new Date();
        const adjustAmount =
          updateMoneyPocketDto.updatedBalance - moneyPocket.balance;

        const adjustmentTransaction = this.transactionRepository.create({
          amount: adjustAmount,
          currency: moneyPocket.currency,
          name: 'User adjustment',
          vendorName: '',
          transactionTime: now.toISOString(),
          moneyPocket: { id: moneyPocket.id },
        });

        await this.transactionRepository.save(adjustmentTransaction);

        moneyPocket.balance = updateMoneyPocketDto.updatedBalance;
      } catch (error) {
        throw new InternalServerErrorException(
          error,
          'Error while updating balance of pocket',
        );
      }
    }

    try {
      return await this.moneyPocketRepository.save(moneyPocket);
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error while saving updated moneyPocket',
      );
    }
  }

  async remove(id: string) {
    const pocketToRemove = await this.findOne(id);

    try {
      const removedPocket =
        await this.moneyPocketRepository.softRemove(pocketToRemove);
      return removedPocket;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to delete money pocket',
      );
    }
  }
}
