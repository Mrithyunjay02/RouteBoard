import { PrismaService } from '../prisma/prisma.service';
export declare class TripHistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getHistoryByTripId(tripId: number, user: any): Promise<{
        id: number;
        changedBy: number;
        previousStatus: import("@prisma/client").$Enums.TripStatus;
        newStatus: import("@prisma/client").$Enums.TripStatus;
        timestamp: Date;
        tripId: number;
    }[]>;
}
