"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const passwordHash = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {
            name: 'Fleet Manager',
        },
        create: {
            email: 'admin@test.com',
            name: 'Fleet Manager',
            password: passwordHash,
            role: client_1.Role.ADMIN,
        },
    });
    console.log('Admin user updated:', admin.email);
    const driver1 = await prisma.user.upsert({
        where: { email: 'driver@test.com' },
        update: { name: 'Rahul Sharma' },
        create: { email: 'driver@test.com', name: 'Rahul Sharma', password: passwordHash, role: client_1.Role.DRIVER },
    });
    console.log('Driver user updated:', driver1.email);
    const driver2 = await prisma.user.upsert({
        where: { email: 'driver2@test.com' },
        update: { name: 'Arjun Kumar' },
        create: { email: 'driver2@test.com', name: 'Arjun Kumar', password: passwordHash, role: client_1.Role.DRIVER },
    });
    console.log('Driver user updated:', driver2.email);
    const driver3 = await prisma.user.upsert({
        where: { email: 'driver3@test.com' },
        update: { name: 'Priya Nair' },
        create: { email: 'driver3@test.com', name: 'Priya Nair', password: passwordHash, role: client_1.Role.DRIVER },
    });
    console.log('Driver user updated:', driver3.email);
    const driver4 = await prisma.user.upsert({
        where: { email: 'driver4@test.com' },
        update: { name: 'Vikram Singh' },
        create: { email: 'driver4@test.com', name: 'Vikram Singh', password: passwordHash, role: client_1.Role.DRIVER },
    });
    console.log('Driver user updated:', driver4.email);
    const driver5 = await prisma.user.upsert({
        where: { email: 'driver5@test.com' },
        update: { name: 'Sneha Reddy' },
        create: { email: 'driver5@test.com', name: 'Sneha Reddy', password: passwordHash, role: client_1.Role.DRIVER },
    });
    console.log('Driver user updated:', driver5.email);
    const drivers = [driver1, driver2, driver3, driver4, driver5];
    await prisma.tripHistory.deleteMany();
    await prisma.trip.deleteMany();
    const vehicles = [
        'KA-01-MA-1023',
        'KA-05-HJ-4589',
        'TN-09-AB-2234',
        'MH-12-CD-8877',
        'TS-08-EF-4567',
        'MH-01-XY-1234',
        'KL-07-ZZ-9876',
        'AP-31-RT-5544',
        'GJ-01-AB-1111',
        'UP-32-CD-2222',
        'MP-09-EF-3333',
        'RJ-14-GH-4444'
    ];
    const routes = [
        { origin: 'Bengaluru', destination: 'Mysuru' },
        { origin: 'Bengaluru', destination: 'Mangaluru' },
        { origin: 'Chennai', destination: 'Coimbatore' },
        { origin: 'Chennai', destination: 'Madurai' },
        { origin: 'Hyderabad', destination: 'Vijayawada' },
        { origin: 'Hyderabad', destination: 'Warangal' },
        { origin: 'Mumbai', destination: 'Pune' },
        { origin: 'Pune', destination: 'Nashik' },
        { origin: 'Kochi', destination: 'Thiruvananthapuram' },
        { origin: 'Ahmedabad', destination: 'Surat' },
        { origin: 'Delhi', destination: 'Jaipur' },
        { origin: 'Lucknow', destination: 'Kanpur' }
    ];
    const statuses = [
        client_1.TripStatus.SCHEDULED,
        client_1.TripStatus.IN_PROGRESS,
        client_1.TripStatus.COMPLETED,
        client_1.TripStatus.CANCELLED
    ];
    for (let i = 0; i < 12; i++) {
        const route = routes[i];
        const status = statuses[i % 4];
        const scheduledStart = new Date(new Date().getTime() + (i - 5) * 24 * 60 * 60 * 1000);
        const assignedDriver = drivers[i % drivers.length];
        const trip = await prisma.trip.create({
            data: {
                vehicleNumber: vehicles[i],
                origin: route.origin,
                destination: route.destination,
                scheduledStart: scheduledStart,
                notes: `Standard logistics run from ${route.origin} to ${route.destination}`,
                status: status,
                driverId: assignedDriver.id,
            },
        });
        if (status === client_1.TripStatus.IN_PROGRESS || status === client_1.TripStatus.COMPLETED) {
            await prisma.tripHistory.create({
                data: {
                    tripId: trip.id,
                    changedBy: assignedDriver.id,
                    previousStatus: client_1.TripStatus.SCHEDULED,
                    newStatus: client_1.TripStatus.IN_PROGRESS,
                }
            });
        }
        if (status === client_1.TripStatus.COMPLETED) {
            await prisma.tripHistory.create({
                data: {
                    tripId: trip.id,
                    changedBy: assignedDriver.id,
                    previousStatus: client_1.TripStatus.IN_PROGRESS,
                    newStatus: client_1.TripStatus.COMPLETED,
                }
            });
        }
        if (status === client_1.TripStatus.CANCELLED) {
            await prisma.tripHistory.create({
                data: {
                    tripId: trip.id,
                    changedBy: admin.id,
                    previousStatus: client_1.TripStatus.SCHEDULED,
                    newStatus: client_1.TripStatus.CANCELLED,
                }
            });
        }
    }
    console.log('12 realistic Indian trips and their history seeded.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map