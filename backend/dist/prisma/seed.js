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
        update: {},
        create: {
            email: 'admin@test.com',
            name: 'Admin User',
            password: passwordHash,
            role: client_1.Role.ADMIN,
        },
    });
    console.log('Admin user created:', admin.email);
    const driver = await prisma.user.upsert({
        where: { email: 'driver@test.com' },
        update: {},
        create: {
            email: 'driver@test.com',
            name: 'Driver User',
            password: passwordHash,
            role: client_1.Role.DRIVER,
        },
    });
    console.log('Driver user created:', driver.email);
    for (let i = 1; i <= 10; i++) {
        await prisma.trip.create({
            data: {
                vehicleNumber: `V-${1000 + i}`,
                origin: `City ${i}`,
                destination: `City ${i + 1}`,
                scheduledStart: new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000),
                notes: `Sample trip ${i}`,
                status: i % 2 === 0 ? client_1.TripStatus.SCHEDULED : client_1.TripStatus.IN_PROGRESS,
                driverId: driver.id,
            },
        });
    }
    console.log('10 Sample trips created.');
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