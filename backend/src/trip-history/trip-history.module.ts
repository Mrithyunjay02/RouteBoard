import { Module } from '@nestjs/common';
import { TripHistoryService } from './trip-history.service';
import { TripHistoryController } from './trip-history.controller';

@Module({
  controllers: [TripHistoryController],
  providers: [TripHistoryService],
})
export class TripHistoryModule {}
