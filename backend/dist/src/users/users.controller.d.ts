import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAllDrivers(): Promise<Partial<{
        id: number;
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>[]>;
}
