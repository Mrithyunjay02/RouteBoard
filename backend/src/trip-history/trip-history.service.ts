import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class TripHistoryService {
  constructor(private prisma: PrismaService) {}

  async getHistoryByTripId(tripId: number, user: any) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new ForbiddenException('Trip not found');

    if (user.role !== Role.ADMIN && trip.driverId !== user.id) {
      throw new ForbiddenException('Cannot access history for this trip');
    }

    return this.prisma.tripHistory.findMany({
      where: { tripId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
