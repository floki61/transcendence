import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { PrismaService } from "src/prisma/prisma.service";
import { Userdto, signindto } from "src/users/dto";
import { UsersService } from "src/users/users.service";
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    private userservice;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService, userservice: UsersService);
    generateToken(req: any): Promise<string>;
    validateUser(req: any, res: any): Promise<boolean>;
    logout(req: any, res: any): Promise<void>;
    signup(dto: Userdto): Promise<{
        id: string;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        picture: string;
        country: string;
        phoneNumber: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    signin(dto: signindto): Promise<{
        id: string;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        picture: string;
        country: string;
        phoneNumber: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
