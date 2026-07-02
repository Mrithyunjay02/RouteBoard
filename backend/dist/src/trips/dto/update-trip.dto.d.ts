import { TripStatus } from '@prisma/client';
export declare class UpdateTripDto {
    vehicleNumber?: string;
    origin?: string;
    destination?: string;
    scheduledStart?: string;
    notes?: string;
    driverId?: number;
    status?: TripStatus;
}
