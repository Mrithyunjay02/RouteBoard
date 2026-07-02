import { TripStatus } from '@prisma/client';
export declare class CreateTripDto {
    vehicleNumber: string;
    origin: string;
    destination: string;
    scheduledStart: string;
    notes?: string;
    driverId: number;
    status?: TripStatus;
}
