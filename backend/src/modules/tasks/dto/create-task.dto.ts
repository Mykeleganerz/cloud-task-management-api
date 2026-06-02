import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Type } from "class-transformer"
import { Priority, Status } from "generated/prisma/client"

export class CreateTaskDto {

    @IsNotEmpty()
    @IsString()
    title!: string

    @IsOptional()
    @IsString()
    description?: string

    status!: Status

    priority!: Priority

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dueDate?: Date
}