"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TripsService = class TripsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(user, driverId) {
        if (user.role === client_1.Role.ADMIN) {
            const whereClause = driverId ? { driverId } : {};
            return this.prisma.trip.findMany({
                where: whereClause,
                include: { driver: true }
            });
        }
        else {
            return this.prisma.trip.findMany({ where: { driverId: user.id } });
        }
    }
    async findOne(id, user) {
        const trip = await this.prisma.trip.findUnique({
            where: { id },
            include: { driver: true, history: true }
        });
        if (!trip)
            throw new common_1.NotFoundException('Trip not found');
        if (user.role !== client_1.Role.ADMIN && trip.driverId !== user.id) {
            throw new common_1.ForbiddenException('Cannot access this trip');
        }
        return trip;
    }
    async create(data) {
        if (data.vehicleNumber) {
            const existing = await this.prisma.trip.findFirst({ where: { vehicleNumber: data.vehicleNumber } });
            if (existing) {
                throw new common_1.BadRequestException('Vehicle number already exists.');
            }
        }
        return this.prisma.trip.create({ data });
    }
    async update(id, data, user) {
        const trip = await this.findOne(id, user);
        if (trip.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Cancelled trips cannot be modified.');
        }
        if (trip.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Completed trips cannot be modified.');
        }
        if (data.vehicleNumber && data.vehicleNumber !== trip.vehicleNumber) {
            const existing = await this.prisma.trip.findFirst({
                where: {
                    vehicleNumber: data.vehicleNumber,
                    id: { not: id }
                }
            });
            if (existing) {
                throw new common_1.BadRequestException('Vehicle number already exists.');
            }
        }
        if (user.role === client_1.Role.DRIVER) {
            if (data.vehicleNumber !== undefined || data.origin !== undefined || data.destination !== undefined || data.scheduledStart !== undefined || data.notes !== undefined || data.driverId !== undefined) {
                throw new common_1.ForbiddenException('Drivers can only update trip status');
            }
            if (data.status === 'CANCELLED') {
                throw new common_1.ForbiddenException('Drivers cannot cancel trips');
            }
            if (data.status && data.status !== trip.status) {
                if (trip.status === 'SCHEDULED' && data.status !== 'IN_PROGRESS') {
                    throw new common_1.BadRequestException('Invalid status transition.');
                }
                if (trip.status === 'IN_PROGRESS' && data.status !== 'COMPLETED') {
                    throw new common_1.BadRequestException('Invalid status transition.');
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
            return trip;
        }
        if (data.status && data.status !== trip.status) {
            if (trip.status === 'SCHEDULED' && data.status !== 'IN_PROGRESS' && data.status !== 'CANCELLED') {
                throw new common_1.BadRequestException('Invalid status transition.');
            }
            if (trip.status === 'IN_PROGRESS' && data.status !== 'COMPLETED' && data.status !== 'CANCELLED') {
                throw new common_1.BadRequestException('Invalid status transition.');
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
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TripsService);
//# sourceMappingURL=trips.service.js.map