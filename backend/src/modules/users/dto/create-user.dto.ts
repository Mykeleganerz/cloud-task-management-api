import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsNotEmpty()
    password!: string

    @ApiProperty()
    @IsOptional()
    name?: string;

    @ApiProperty()
    @IsNotEmpty()
    role!: Role
}