import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "generated/prisma/client";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    password!: string

    @IsOptional()
    name?: string;

    @IsNotEmpty()
    role!: Role
}