import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/prisma/prisma.service";
export declare class RolesGuard implements CanActivate {
    private readonly reflector;
    private prima;
    constructor(reflector: Reflector, prima: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
