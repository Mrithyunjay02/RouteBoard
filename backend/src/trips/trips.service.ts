import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Trip, TripStatus, Role } from '@prisma/client';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: any, driverId?: number): Promise<Trip[]> {
    if (user.role === Role.ADMIN) {
      const whereClause = driverId ? { driverId } : {};
      return this.prisma.trip.findMany({ 
        where: whereClause,
        include: { driver: true } 
      });
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
    if (data.vehicleNumber) {
      const existing = await this.prisma.trip.findFirst({ where: { vehicleNumber: data.vehicleNumber } });
      if (existing) {
        throw new BadRequestException('Vehicle number already exists.');
      }
    }
    return this.prisma.trip.create({ data });
  }

  async update(id: number, data: any, user: any): Promise<Trip> {
    const trip = await this.findOne(id, user);

    if (trip.status === 'CANCELLED') {
      throw new BadRequestException('Cancelled trips cannot be modified.');
    }
    if (trip.status === 'COMPLETED') {
      throw new BadRequestException('Completed trips cannot be modified.');
    }

    if (data.vehicleNumber && data.vehicleNumber !== trip.vehicleNumber) {
      const existing = await this.prisma.trip.findFirst({
        where: {
          vehicleNumber: data.vehicleNumber,
          id: { not: id }
        }
      });
      if (existing) {
        throw new BadRequestException('Vehicle number already exists.');
      }
    }

    if (user.role === Role.DRIVER) {
      // Drivers can only update status
      if (data.vehicleNumber !== undefined || data.origin !== undefined || data.destination !== undefined || data.scheduledStart !== undefined || data.notes !== undefined || data.driverId !== undefined) {
        throw new ForbiddenException('Drivers can only update trip status');
      }

      if (data.status === 'CANCELLED') {
        throw new ForbiddenException('Drivers cannot cancel trips');
      }

      if (data.status && data.status !== trip.status) {
        if (trip.status === 'SCHEDULED' && data.status !== 'IN_PROGRESS') {
          throw new BadRequestException('Invalid status transition.');
        }
        if (trip.status === 'IN_PROGRESS' && data.status !== 'COMPLETED') {
          throw new BadRequestException('Invalid status transition.');
        }

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
      if (trip.status === 'SCHEDULED' && data.status !== 'IN_PROGRESS' && data.status !== 'CANCELLED') {
        throw new BadRequestException('Invalid status transition.');
      }
      if (trip.status === 'IN_PROGRESS' && data.status !== 'COMPLETED' && data.status !== 'CANCELLED') {
        throw new BadRequestException('Invalid status transition.');
      }

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
}
