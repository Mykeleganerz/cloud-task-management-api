import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CredentialsInputDto {

    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsString()
    @IsNotEmpty()
    password!: string
}