import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    success(user: any): Promise<{
        accessToken: string;
        player_info: import(".prisma/client").User;
    }>;
}
