import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UsersService {
    private jwt;
    private config;
    private prisma;
    constructor(jwt: JwtService, config: ConfigService, prisma: PrismaService);
    getUser(idu: string): Promise<{
        id: string;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        picture: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createUser(req: any): Promise<{
        id: string;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        picture: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    sendFriendRequest(userId: string, friendId: string): Promise<{
        id: string;
        userId: string;
        friendId: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
    }>;
    cancelFriendRequest(userId: string, friendId: string): Promise<{
        id: string;
        userId: string;
        friendId: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
    }>;
    acceptFriendRequest(userId: string, friendId: string): Promise<{
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
    }>;
    creatChatRoom(userId: string, friendId: string): Promise<{
        id: string;
        name: string;
        visibility: import(".prisma/client").$Enums.Visibility;
        password: string;
        is_DM: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    rejectFriendRequest(userId: string, friendId: string): Promise<void>;
    unfriend(userId: string, friendId: string): Promise<void>;
    checkFriendship(userId: string, friendId: string): Promise<boolean>;
    blockUser(userId: string, friendId: string): Promise<{
        id: string;
        uid: string;
        fid: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    unblockUser(userId: string, friendId: string): Promise<{
        id: string;
        uid: string;
        fid: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
