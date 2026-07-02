import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
export declare class TripsController {
    private readonly tripsService;
    constructor(tripsService: TripsService);
    create(createTripDto: CreateTripDto): Promise<{
        id: number;
        vehicleNumber: string;
        origin: string;
        destination: string;
        scheduledStart: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.TripStatus;
        driverId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(req: any): Promise<{
        id: number;
        vehicleNumber: string;
        origin: string;
        destination: string;
        scheduledStart: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.TripStatus;
        driverId: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string, req: any): Promise<{
        id: number;
        vehicleNumber: string;
        origin: string;
        destination: string;
        scheduledStart: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.TripStatus;
        driverId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateTripDto: UpdateTripDto, req: any): Promise<{
        id: number;
        vehicleNumber: string;
        origin: string;
        destination: string;
        scheduledStart: Date;
        notes: string | null;
        status: import("@prisma/client").$Enums.TripStatus;
        driverId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<void>;
}
