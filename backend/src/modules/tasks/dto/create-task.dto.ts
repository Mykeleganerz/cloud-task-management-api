import { Type } from "class-transformer"
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Priority, Status } from "generated/prisma/client"

export class CreateTaskDto {

    @IsNotEmpty()
    @IsString()
    title!: string

    @IsOptional()
    @IsString()
    description?: string

    @IsEnum(Status)
    status!: Status

    @IsEnum(Priority)
    priority!: Priority

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dueDate?: Date
}