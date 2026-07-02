import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { TripHistoryService } from './trip-history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class TripHistoryController {
  constructor(private readonly historyService: TripHistoryService) {}

  @Get(':tripId')
  getHistory(@Param('tripId') tripId: string, @Request() req: any) {
    return this.historyService.getHistoryByTripId(+tripId, req.user);
  }
}
