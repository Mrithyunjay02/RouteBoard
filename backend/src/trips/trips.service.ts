import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Trip, TripStatus, Role } from '@prisma/client';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: any): Promise<Trip[]> {
    if (user.role === Role.ADMIN) {
      return this.prisma.trip.findMany({ include: { driver: true } });
    } else {
      return this.prisma.trip.findMany({ where: { driverId: user.id } });
    }
  }

  async findOne(id: number, user: any): Promise<Trip> {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: { driver: true, history: true }
    });
    if (!trip) throw new NotFoundException('Trip not found');
    
    if (user.role !== Role.ADMIN && trip.driverId !== user.id) {
      throw new ForbiddenException('Cannot access this trip');
    }
    
    return trip;
  }

  async create(data: any): Promise<Trip> {
    return this.prisma.trip.create({ data });
  }

  async update(id: number, data: any, user: any): Promise<Trip> {
    const trip = await this.findOne(id, user);

    if (user.role === Role.DRIVER) {
      // Drivers can only update status
      if (data.status && data.status !== trip.status) {
        await this.prisma.tripHistory.create({
          data: {
            tripId: trip.id,
            changedBy: user.id,
            previousStatus: trip.status,
            newStatus: data.status,
          }
        });
        return this.prisma.trip.update({
          where: { id },
          data: { status: data.status },
        });
      }
      return trip; // No change if no status update
    }

    // Admin update logic here
    if (data.status && data.status !== trip.status) {
      await this.prisma.tripHistory.create({
        data: {
          tripId: trip.id,
          changedBy: user.id,
          previousStatus: trip.status,
          newStatus: data.status,
        }
      });
    }

    return this.prisma.trip.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.trip.delete({ where: { id } });
  }
}
