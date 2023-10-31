import { CanActivate } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
export declare class WsGuard implements CanActivate {
    private userService;
    private jwt;
    private config;
    constructor(userService: UsersService, jwt: JwtService, config: ConfigService);
    canActivate(context: any): boolean | any | Promise<boolean | any> | Observable<boolean | any>;
}
