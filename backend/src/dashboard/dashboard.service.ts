import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripStatus, Role } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(user: any) {
    const whereClause = user.role === Role.ADMIN ? {} : { driverId: user.id };

    const total = await this.prisma.trip.count({ where: whereClause });
    const scheduled = await this.prisma.trip.count({ where: { ...whereClause, status: TripStatus.SCHEDULED } });
    const inProgress = await this.prisma.trip.count({ where: { ...whereClause, status: TripStatus.IN_PROGRESS } });
    const completed = await this.prisma.trip.count({ where: { ...whereClause, status: TripStatus.COMPLETED } });
    const cancelled = await this.prisma.trip.count({ where: { ...whereClause, status: TripStatus.CANCELLED } });

    return {
      total,
      scheduled,
      inProgress,
      completed,
      cancelled,
    };
  }
}
