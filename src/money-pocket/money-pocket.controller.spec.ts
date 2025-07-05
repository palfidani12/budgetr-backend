import { Test, TestingModule } from '@nestjs/testing';
import { MoneyPocketController } from './money-pocket.controller';
import { MoneyPocketService } from './money-pocket.service';
import { UpdateMoneyPocketDto } from './dto/update-money-pocket.dto';

describe('MoneyPocketController', () => {
  let controller: MoneyPocketController;
  const mockMoneyPocketService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockMoneyPocket = { id: 'pocketId' };

  const mockCreatePocketDto = {
    startBalance: 100,
    currency: 'HUF',
    pocketName: 'Erste bankszamla',
    pocketType: 'bankAccount',
    iconUrl: '',
    userId: 'a3e579dc-53fa-4d81-84c7-e914c017872c',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoneyPocketController],
      providers: [
        { provide: MoneyPocketService, useValue: mockMoneyPocketService },
      ],
    }).compile();

    controller = module.get<MoneyPocketController>(MoneyPocketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a moneypocket successfully', async () => {
    mockMoneyPocketService.create.mockResolvedValue(mockMoneyPocket);

    const result = await controller.createPocket(mockCreatePocketDto);

    expect(mockMoneyPocketService.create).toHaveBeenCalledTimes(1);
    expect(mockMoneyPocketService.create).toHaveBeenCalledWith(
      mockCreatePocketDto,
    );
    expect(result).toEqual(mockMoneyPocket);
  });

  it('should find a moneypocket successfully', async () => {
    mockMoneyPocketService.findOne.mockResolvedValue(mockMoneyPocket);

    const result = await controller.findOneById('searchId');

    expect(mockMoneyPocketService.findOne).toHaveBeenCalledTimes(1);
    expect(mockMoneyPocketService.findOne).toHaveBeenCalledWith('searchId');
    expect(result).toEqual(mockMoneyPocket);
  });

  it('should update a moneypocket successfully', async () => {
    mockMoneyPocketService.update.mockResolvedValue({ id: 'updatedPocketId' });

    const result = await controller.updatePocketInformation('pocketId', {
      updatedBalance: 100,
    } as UpdateMoneyPocketDto);

    expect(mockMoneyPocketService.update).toHaveBeenCalledTimes(1);
    expect(mockMoneyPocketService.update).toHaveBeenCalledWith('pocketId', {
      updatedBalance: 100,
    });
    expect(result).toEqual({ id: 'updatedPocketId' });
  });

  it('should delete a moneypocket successfully', async () => {
    mockMoneyPocketService.remove.mockResolvedValue({ id: 'deletedPocketId' });

    const result = await controller.removePocket('removeId');

    expect(mockMoneyPocketService.remove).toHaveBeenCalledTimes(1);
    expect(mockMoneyPocketService.remove).toHaveBeenCalledWith('removeId');
    expect(result).toEqual({ id: 'deletedPocketId' });
  });
});
