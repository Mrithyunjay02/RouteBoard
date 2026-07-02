import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(req: any): Promise<{
        total: number;
        scheduled: number;
        inProgress: number;
        completed: number;
        cancelled: number;
    }>;
}
