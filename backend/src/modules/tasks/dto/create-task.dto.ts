import { Type } from "class-transformer"
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Priority, Status } from "@prisma/client"
import { ApiProperty } from "@nestjs/swagger"

export class CreateTaskDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title!: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty()
    @IsEnum(Status)
    status!: Status

    @ApiProperty()
    @IsEnum(Priority)
    priority!: Priority

    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dueDate?: Date
}