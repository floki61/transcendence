import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class Userdto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
    
    @IsString()
    firstName: string;
    
    @IsString()
    lastName: string;
}

export class signindto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
}