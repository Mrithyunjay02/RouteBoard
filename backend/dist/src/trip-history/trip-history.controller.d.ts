import { TripHistoryService } from './trip-history.service';
export declare class TripHistoryController {
    private readonly historyService;
    constructor(historyService: TripHistoryService);
    getHistory(tripId: string, req: any): Promise<{
        id: number;
        changedBy: number;
        previousStatus: import("@prisma/client").$Enums.TripStatus;
        newStatus: import("@prisma/client").$Enums.TripStatus;
        timestamp: Date;
        tripId: number;
    }[]>;
}
