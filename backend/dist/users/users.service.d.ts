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
        level: number;
        firstName: string;
        lastName: string;
        status: import(".prisma/client").$Enums.Stts;
        email: string;
        picture: string;
        country: string;
        phoneNumber: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    checkIfnameExists(username: string): Promise<boolean>;
    updateUser(req: any, data: any): Promise<void>;
    updateUserPicture(req: any, data: any): Promise<{
        id: string;
        userName: string;
        level: number;
        firstName: string;
        lastName: string;
        status: import(".prisma/client").$Enums.Stts;
        email: string;
        picture: string;
        country: string;
        phoneNumber: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserName(req: any, data: any): Promise<{
        id: string;
        userName: string;
        level: number;
        firstName: string;
        lastName: string;
        status: import(".prisma/client").$Enums.Stts;
        email: string;
        picture: string;
        country: string;
        phoneNumber: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | "Username already exists">;
    updateUserPhoneNumber(req: any, data: any): Promise<{
        id: string;
        userName: string;
        level: number;
        firstName: string;
        lastName: string;
        status: import(".prisma/client").$Enums.Stts;
        email: string;
        picture: string;
        country: string;
        phoneNumber: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserCountry(req: any, data: any): Promise<{
        id: string;
        userName: string;
        level: number;
        firstName: string;
        lastName: string;
        status: import(".prisma/client").$Enums.Stts;
        email: string;
        picture: string;
        country: string;
        phoneNumber: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createUser(req: any): Promise<{
        id: string;
        userName: string;
        level: number;
        firstName: string;
        lastName: string;
        status: import(".prisma/client").$Enums.Stts;
        email: string;
        picture: string;
        country: string;
        phoneNumber: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserNameWithId(id: string): Promise<string>;
    getPictureWithId(id: string): Promise<string>;
    sendPlayRequest(userId: string, friendId: string): Promise<{
        user: {
            id: string;
            userName: string;
            level: number;
            firstName: string;
            lastName: string;
            status: import(".prisma/client").$Enums.Stts;
            email: string;
            picture: string;
            country: string;
            phoneNumber: string;
            accessToken: string;
            password: string;
            twoFactorAuthenticationSecret: string;
            isTwoFactorAuthenticationEnabled: boolean;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    sendFriendRequest(userId: string, friendId: string): Promise<{
        friendrequest: {
            id: string;
            userId: string;
            friendId: string;
            status: import(".prisma/client").$Enums.Status;
            createdAt: Date;
            updatedAt: Date;
        };
        user: {
            id: string;
            userName: string;
            level: number;
            firstName: string;
            lastName: string;
            status: import(".prisma/client").$Enums.Stts;
            email: string;
            picture: string;
            country: string;
            phoneNumber: string;
            accessToken: string;
            password: string;
            twoFactorAuthenticationSecret: string;
            isTwoFactorAuthenticationEnabled: boolean;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
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
            picture: string;
            lastMessageDate: Date;
            visibility: import(".prisma/client").$Enums.Visibility;
            password: string;
            lastMessage: string;
            is_DM: boolean;
            createdAt: Date;
            updatedAt: Date;
        }>;
    }>;
    creatChatRoom(userId: string, friendId: string): Promise<{
        id: string;
        name: string;
        picture: string;
        lastMessageDate: Date;
        visibility: import(".prisma/client").$Enums.Visibility;
        password: string;
        lastMessage: string;
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
    deleteAccount(userId: string): Promise<void>;
    getFriends(userId: string): Promise<{
        friendRequests: ({
            user: {
                id: string;
                userName: string;
                level: number;
                firstName: string;
                lastName: string;
                status: import(".prisma/client").$Enums.Stts;
                email: string;
                picture: string;
                country: string;
                phoneNumber: string;
                accessToken: string;
                password: string;
                twoFactorAuthenticationSecret: string;
                isTwoFactorAuthenticationEnabled: boolean;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            friend: {
                id: string;
                userName: string;
                level: number;
                firstName: string;
                lastName: string;
                status: import(".prisma/client").$Enums.Stts;
                email: string;
                picture: string;
                country: string;
                phoneNumber: string;
                accessToken: string;
                password: string;
                twoFactorAuthenticationSecret: string;
                isTwoFactorAuthenticationEnabled: boolean;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            userId: string;
            friendId: string;
            status: import(".prisma/client").$Enums.Status;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    getFriendRequests(userId: string): Promise<({
        user: {
            id: string;
            userName: string;
            level: number;
            firstName: string;
            lastName: string;
            status: import(".prisma/client").$Enums.Stts;
            email: string;
            picture: string;
            country: string;
            phoneNumber: string;
            accessToken: string;
            password: string;
            twoFactorAuthenticationSecret: string;
            isTwoFactorAuthenticationEnabled: boolean;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        userId: string;
        friendId: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getIfBlocked(userId: string, friendId: string): Promise<boolean>;
    getFriendProfile(userId: string, id: string): Promise<{
        isfriend: string;
        ifBlocked: boolean;
        level_P: number;
        barPourcentage: any;
        user: {
            id: string;
            userName: string;
            level: number;
            firstName: string;
            lastName: string;
            status: import(".prisma/client").$Enums.Stts;
            email: string;
            picture: string;
            country: string;
            phoneNumber: string;
            accessToken: string;
            password: string;
            twoFactorAuthenticationSecret: string;
            isTwoFactorAuthenticationEnabled: boolean;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getFriendProfileWithUserName(userName: string, id: string): Promise<{
        isfriend: string;
        ifBlocked: boolean;
        level_P: number;
        barPourcentage: any;
        user: {
            id: string;
            userName: string;
            level: number;
            firstName: string;
            lastName: string;
            status: import(".prisma/client").$Enums.Stts;
            email: string;
            picture: string;
            country: string;
            phoneNumber: string;
            accessToken: string;
            password: string;
            twoFactorAuthenticationSecret: string;
            isTwoFactorAuthenticationEnabled: boolean;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getAllUsers(): Promise<{
        id: string;
        userName: string;
        level: number;
        firstName: string;
        lastName: string;
        status: import(".prisma/client").$Enums.Stts;
        email: string;
        picture: string;
        country: string;
        phoneNumber: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getLevelP(lvl: number): Promise<{
        level_P: number;
        barPourcentage: any;
    }>;
    getProfile(userId: string): Promise<{
        level_P: number;
        barPourcentage: any;
        user: {
            id: string;
            userName: string;
            level: number;
            firstName: string;
            lastName: string;
            status: import(".prisma/client").$Enums.Stts;
            email: string;
            picture: string;
            country: string;
            phoneNumber: string;
            accessToken: string;
            password: string;
            twoFactorAuthenticationSecret: string;
            isTwoFactorAuthenticationEnabled: boolean;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getStats(body: any): Promise<{
        stats: {
            MP: number;
            W: number;
            L: number;
            GS: number;
            GC: number;
        };
        gamestats: {
            id: string;
            mode: string;
            player1Id: string;
            player2Id: string;
            player1Score: number;
            player2Score: number;
            winnerId: string;
            loserId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    getAchievements(userId: string): Promise<{
        id: string;
        uid: string;
        achivementName: string;
        alreadyAchieved: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getLeaderboard(body: any): Promise<({
        wins: {
            id: string;
            mode: string;
            player1Id: string;
            player2Id: string;
            player1Score: number;
            player2Score: number;
            winnerId: string;
            loserId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        loses: {
            id: string;
            mode: string;
            player1Id: string;
            player2Id: string;
            player1Score: number;
            player2Score: number;
            winnerId: string;
            loserId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        userName: string;
        level: number;
        firstName: string;
        lastName: string;
        status: import(".prisma/client").$Enums.Stts;
        email: string;
        picture: string;
        country: string;
        phoneNumber: string;
        accessToken: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getBlockedList(userId: string): Promise<({
        friend: {
            id: string;
            userName: string;
            level: number;
            firstName: string;
            lastName: string;
            status: import(".prisma/client").$Enums.Stts;
            email: string;
            picture: string;
            country: string;
            phoneNumber: string;
            accessToken: string;
            password: string;
            twoFactorAuthenticationSecret: string;
            isTwoFactorAuthenticationEnabled: boolean;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        uid: string;
        fid: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
