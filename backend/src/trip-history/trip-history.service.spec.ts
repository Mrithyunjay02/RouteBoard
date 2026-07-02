import { Test, TestingModule } from '@nestjs/testing';
import { TripHistoryService } from './trip-history.service';

describe('TripHistoryService', () => {
  let service: TripHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripHistoryService],
    }).compile();

    service = module.get<TripHistoryService>(TripHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
