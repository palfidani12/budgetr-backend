import { Test, TestingModule } from '@nestjs/testing';
import { MoneyPocketService } from './money-pocket.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoneyPocket } from 'src/typeorm-entities/money-pocket.entity';
import { User } from 'src/typeorm-entities/user.entity';
import { Transaction } from 'src/typeorm-entities/transaction.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('MoneyPocketService', () => {
  let service: MoneyPocketService;
  const mockMoneyPocketRepository = {
    save: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    softRemove: jest.fn(),
  };
  const mockUserRepository = {
    findOneBy: jest.fn(),
  };
  const mockTransactionRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCreateMoneyPocketDto = {
    startBalance: 100,
    currency: 'HUF',
    pocketName: 'Erste bankszamla',
    pocketType: 'bankAccount',
    iconUrl: '',
    userId: 'a3e579dc-53fa-4d81-84c7-e914c017872c',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoneyPocketService,
        {
          provide: getRepositoryToken(MoneyPocket),
          useValue: mockMoneyPocketRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<MoneyPocketService>(MoneyPocketService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error when fails to retrieve user', async () => {
      mockUserRepository.findOneBy.mockRejectedValue(
        new Error('cannot retrieve user'),
      );
      await expect(service.create(mockCreateMoneyPocketDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: mockCreateMoneyPocketDto.userId,
      });
    });

    it('should throw an error when fails to find user', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(mockCreateMoneyPocketDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: mockCreateMoneyPocketDto.userId,
      });
    });

    it('should throw an error when fails to save pocket', async () => {
      mockUserRepository.findOneBy.mockResolvedValue({ id: 'userId' });
      mockMoneyPocketRepository.create.mockReturnValue({ id: 'createdPocket' });
      mockMoneyPocketRepository.save.mockRejectedValueOnce(
        new Error('cannot save element'),
      );

      await expect(service.create(mockCreateMoneyPocketDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockMoneyPocketRepository.create).toHaveBeenCalledTimes(1);
      expect(mockMoneyPocketRepository.create).toHaveBeenCalledWith({
        balance: mockCreateMoneyPocketDto.startBalance,
        currency: mockCreateMoneyPocketDto.currency,
        name: mockCreateMoneyPocketDto.pocketName,
        type: mockCreateMoneyPocketDto.pocketType,
        iconUrl: mockCreateMoneyPocketDto.iconUrl,
        user: { id: 'userId' },
      });
      expect(mockMoneyPocketRepository.save).toHaveBeenCalledTimes(1);
      expect(mockMoneyPocketRepository.save).toHaveBeenCalledWith({
        id: 'createdPocket',
      });
    });

    it('should return saved entity on a successfull creation', async () => {
      mockUserRepository.findOneBy.mockResolvedValue({ id: 'userId' });
      mockMoneyPocketRepository.create.mockReturnValue({ id: 'createdPocket' });
      mockMoneyPocketRepository.save.mockResolvedValue({ id: 'savedPocket' });

      await expect(service.create(mockCreateMoneyPocketDto)).resolves.toEqual({
        id: 'savedPocket',
      });

      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        id: mockCreateMoneyPocketDto.userId,
      });

      expect(mockMoneyPocketRepository.create).toHaveBeenCalledTimes(1);
      expect(mockMoneyPocketRepository.create).toHaveBeenCalledWith({
        balance: mockCreateMoneyPocketDto.startBalance,
        currency: mockCreateMoneyPocketDto.currency,
        name: mockCreateMoneyPocketDto.pocketName,
        type: mockCreateMoneyPocketDto.pocketType,
        iconUrl: mockCreateMoneyPocketDto.iconUrl,
        user: { id: 'userId' },
      });

      expect(mockMoneyPocketRepository.save).toHaveBeenCalledTimes(1);
      expect(mockMoneyPocketRepository.save).toHaveBeenCalledWith({
        id: 'createdPocket',
      });
    });
  });

  describe('findOne', () => {
    it('should throw an error if there is an error while retieving the entity', async () => {
      mockMoneyPocketRepository.findOne.mockRejectedValue(
        new Error('error while searching'),
      );

      await expect(service.findOne('pocketId')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockMoneyPocketRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockMoneyPocketRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'pocketId' },
        relations: ['transactions', 'recurringTransactions'],
      });
    });

    it('should throw an error if there is no entity found', async () => {
      mockMoneyPocketRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('pocketId')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockMoneyPocketRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockMoneyPocketRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'pocketId' },
        relations: ['transactions', 'recurringTransactions'],
      });
    });

    it('should return the money pocket', async () => {
      mockMoneyPocketRepository.findOne.mockResolvedValue({
        id: 'foundPocket',
      });

      await expect(service.findOne('pocketId')).resolves.toEqual({
        id: 'foundPocket',
      });

      expect(mockMoneyPocketRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockMoneyPocketRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'pocketId' },
        relations: ['transactions', 'recurringTransactions'],
      });
    });
  });

  describe('update', () => {
    const mockUpdatePocketDto = {
      updatedBalance: 200,
      pocketName: 'Sandor',
      pocketType: 'credit',
      iconUrl: 'sajt.com',
    };

    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should throw an error if the adjustment transaction cannot be saved', async () => {
      mockMoneyPocketRepository.findOne.mockResolvedValue({
        id: 'pocketId',
        currency: 'EUR',
        balance: 300,
      });
      mockTransactionRepository.create.mockReturnValue({
        id: 'updateTransactionId',
      });
      mockTransactionRepository.save.mockRejectedValue(
        new Error('failed to save transaction'),
      );

      await expect(
        service.update('pocketId', mockUpdatePocketDto),
      ).rejects.toThrow(InternalServerErrorException);

      expect(mockTransactionRepository.create).toHaveBeenCalledTimes(1);
      expect(mockTransactionRepository.create).toHaveBeenCalledWith({
        amount: -100,
        currency: 'EUR',
        name: 'User adjustment',
        vendorName: '',
        transactionTime: '2024-01-01T00:00:00.000Z',
        moneyPocket: { id: 'pocketId' },
      });
      expect(mockTransactionRepository.save).toHaveBeenCalledTimes(1);
      expect(mockTransactionRepository.save).toHaveBeenCalledWith({
        id: 'updateTransactionId',
      });
    });

    it('should throw an error if the money pocket cannot be saved', async () => {
      mockMoneyPocketRepository.findOne.mockResolvedValue({
        id: 'pocketId',
        currency: 'EUR',
        balance: 300,
      });
      mockMoneyPocketRepository.save.mockRejectedValue(
        new Error('cannot save now'),
      );
      mockTransactionRepository.create.mockReturnValue({
        id: 'updateTransactionId',
      });
      mockTransactionRepository.save.mockResolvedValue({ id: 'transactionId' });

      await expect(
        service.update('pocketId', mockUpdatePocketDto),
      ).rejects.toThrow(InternalServerErrorException);

      expect(mockTransactionRepository.save).toHaveBeenCalledTimes(1);
      expect(mockTransactionRepository.save).toHaveBeenCalledWith({
        id: 'updateTransactionId',
      });
    });

    it('should return the updated money pocket and create an update transaction', async () => {
      mockMoneyPocketRepository.findOne.mockResolvedValue({
        id: 'pocketId',
        currency: 'EUR',
        balance: 300,
        name: 'SandorBefore',
      });
      mockMoneyPocketRepository.save.mockResolvedValue({ id: 'updatedPocket' });
      mockTransactionRepository.create.mockReturnValue({
        id: 'updateTransactionId',
      });
      mockTransactionRepository.save.mockResolvedValue({ id: 'transactionId' });

      await expect(
        service.update('pocketId', mockUpdatePocketDto),
      ).resolves.toEqual({ id: 'updatedPocket' });

      expect(mockTransactionRepository.create).toHaveBeenCalledTimes(1);
      expect(mockTransactionRepository.create).toHaveBeenCalledWith({
        amount: -100,
        currency: 'EUR',
        name: 'User adjustment',
        vendorName: '',
        transactionTime: '2024-01-01T00:00:00.000Z',
        moneyPocket: { id: 'pocketId' },
      });

      expect(mockTransactionRepository.save).toHaveBeenCalledTimes(1);
      expect(mockTransactionRepository.save).toHaveBeenCalledWith({
        id: 'updateTransactionId',
      });

      expect(mockMoneyPocketRepository.save).toHaveBeenCalledTimes(1);
      expect(mockMoneyPocketRepository.save).toHaveBeenCalledWith({
        balance: 200,
        currency: 'EUR',
        iconUrl: 'sajt.com',
        id: 'pocketId',
        name: 'Sandor',
        type: 'credit',
      });
    });
  });

  describe('remove', () => {
    it('should throw an error if there is an error while deleting the entity', async () => {
      mockMoneyPocketRepository.softRemove.mockRejectedValue(
        new Error('cannot delete element'),
      );
      mockMoneyPocketRepository.findOne.mockResolvedValue({
        id: 'pocketToRemove',
      });

      await expect(service.remove('pocketId')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockMoneyPocketRepository.softRemove).toHaveBeenCalledTimes(1);
      expect(mockMoneyPocketRepository.softRemove).toHaveBeenCalledWith({
        id: 'pocketToRemove',
      });
    });

    it('should return the deleted money pocket', async () => {
      mockMoneyPocketRepository.softRemove.mockResolvedValue({
        id: 'deletedPocketId',
      });
      mockMoneyPocketRepository.findOne.mockResolvedValue({
        id: 'pocketToRemove',
      });

      await expect(service.remove('pocketId')).resolves.toEqual({
        id: 'deletedPocketId',
      });

      expect(mockMoneyPocketRepository.softRemove).toHaveBeenCalledTimes(1);
      expect(mockMoneyPocketRepository.softRemove).toHaveBeenCalledWith({
        id: 'pocketToRemove',
      });
    });
  });
});
