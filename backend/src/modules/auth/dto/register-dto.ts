import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name!: string;
}