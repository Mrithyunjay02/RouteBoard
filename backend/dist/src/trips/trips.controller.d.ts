import { TripsService } from './trips.service';
export declare class TripsController {
    private readonly tripsService;
    constructor(tripsService: TripsService);
    create(createTripDto: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vehicleNumber: string;
        origin: string;
        destination: string;
        scheduledStart: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.TripStatus;
        driverId: number;
    }>;
    findAll(req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vehicleNumber: string;
        origin: string;
        destination: string;
        scheduledStart: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.TripStatus;
        driverId: number;
    }[]>;
    findOne(id: string, req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vehicleNumber: string;
        origin: string;
        destination: string;
        scheduledStart: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.TripStatus;
        driverId: number;
    }>;
    update(id: string, updateTripDto: any, req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vehicleNumber: string;
        origin: string;
        destination: string;
        scheduledStart: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.TripStatus;
        driverId: number;
    }>;
    remove(id: string): Promise<void>;
}
