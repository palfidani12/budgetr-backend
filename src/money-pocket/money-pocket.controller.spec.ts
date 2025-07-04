import { Test, TestingModule } from '@nestjs/testing';
import { MoneyPocketController } from './money-pocket.controller';
import { MoneyPocketService } from './money-pocket.service';

describe('MoneyPocketController', () => {
  let controller: MoneyPocketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoneyPocketController],
      providers: [MoneyPocketService],
    }).compile();

    controller = module.get<MoneyPocketController>(MoneyPocketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
