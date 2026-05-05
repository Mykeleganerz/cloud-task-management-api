import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Priority, Status } from "generated/prisma"

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
    dueDate?: Date
}