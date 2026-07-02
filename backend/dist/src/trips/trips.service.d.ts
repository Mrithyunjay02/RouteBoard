import { PrismaService } from '../prisma/prisma.service';
import { Trip } from '@prisma/client';
export declare class TripsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: any): Promise<Trip[]>;
    findOne(id: number, user: any): Promise<Trip>;
    create(data: any): Promise<Trip>;
    update(id: number, data: any, user: any): Promise<Trip>;
    remove(id: number): Promise<void>;
}
