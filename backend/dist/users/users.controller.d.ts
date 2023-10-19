/// <reference types="multer" />
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UsersGateway } from './users.gateway';
export declare class UsersController {
    private config;
    private jwt;
    private userservice;
    private usergtw;
    constructor(config: ConfigService, jwt: JwtService, userservice: UsersService, usergtw: UsersGateway);
    home(req: any): Promise<{
        user: any;
        cookies: any;
    }>;
    sendFriendRequest(body: any, req: any): Promise<{
        id: string;
        userId: string;
        friendId: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
    }>;
    cancelFriendRequest(body: any, req: any): Promise<{
        id: string;
        userId: string;
        friendId: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
    }>;
    acceptFrienRequest(body: any, req: any): Promise<{
        friendrequest: {
            friendrequest: {
                id: string;
                userId: string;
                friendId: string;
                status: import(".prisma/client").$Enums.Status;
                createdAt: Date;
                updatedAt: Date;
            };
            chatRoom?: undefined;
        } | {
            friendrequest: {
                id: string;
                userId: string;
                friendId: string;
                status: import(".prisma/client").$Enums.Status;
                createdAt: Date;
                updatedAt: Date;
            };
            chatRoom: Promise<{
                id: string;
                name: string;
                visibility: import(".prisma/client").$Enums.Visibility;
                password: string;
                is_DM: boolean;
                createdAt: Date;
                updatedAt: Date;
            }>;
        };
    }>;
    rejectFrienRequest(body: any, req: any): Promise<void>;
    unfriend(body: any, req: any): Promise<void>;
    uploadFile(file: Express.Multer.File, req: any): Promise<Express.Multer.File>;
    blockUser(body: any, req: any): Promise<{
        id: string;
        uid: string;
        fid: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    unblockUser(body: any, req: any): Promise<{
        id: string;
        uid: string;
        fid: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}