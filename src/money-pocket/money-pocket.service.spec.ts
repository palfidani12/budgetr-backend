import { Test, TestingModule } from '@nestjs/testing';
import { MoneyPocketService } from './money-pocket.service';

describe('MoneyPocketService', () => {
  let service: MoneyPocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoneyPocketService],
    }).compile();

    service = module.get<MoneyPocketService>(MoneyPocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
