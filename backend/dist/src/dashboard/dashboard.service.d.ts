import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(user: any): Promise<{
        total: number;
        scheduled: number;
        inProgress: number;
        completed: number;
        cancelled: number;
    }>;
}
