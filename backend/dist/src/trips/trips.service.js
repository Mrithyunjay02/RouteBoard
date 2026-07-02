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
    async findAll(user) {
        if (user.role === client_1.Role.ADMIN) {
            return this.prisma.trip.findMany({ include: { driver: true } });
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
        return this.prisma.trip.create({ data });
    }
    async update(id, data, user) {
        const trip = await this.findOne(id, user);
        if (user.role === client_1.Role.DRIVER) {
            if (data.vehicleNumber !== undefined || data.origin !== undefined || data.destination !== undefined || data.scheduledStart !== undefined || data.notes !== undefined || data.driverId !== undefined) {
                throw new common_1.ForbiddenException('Drivers can only update trip status');
            }
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
            return trip;
        }
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
    async remove(id) {
        await this.prisma.trip.delete({ where: { id } });
    }
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TripsService);
//# sourceMappingURL=trips.service.js.map