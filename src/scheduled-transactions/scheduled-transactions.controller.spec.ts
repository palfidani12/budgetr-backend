import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledTransactionsController } from './scheduled-transactions.controller';
import { ScheduledTransactionsService } from './scheduled-transactions.service';

describe('ScheduledTransactionsController', () => {
  let controller: ScheduledTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduledTransactionsController],
      providers: [ScheduledTransactionsService],
    }).compile();

    controller = module.get<ScheduledTransactionsController>(ScheduledTransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
