import { Status, Priority } from "generated/prisma/enums";
import { IsOptional, IsDate, IsNotEmpty, IsEnum, IsString, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    @IsEnum(Status, {
        message: 'Valid status required (PENDING, IN_PROGRESS, COMPLETED)'
    })
    status?: Status;

    @IsOptional()
    @IsEnum(Priority, {
        message: 'Valid priority required (LOW, MEDIUM, HIGH)'
    })
    priority?: Priority;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dueDate?: Date;

    @IsNotEmpty()
    @IsNumber()
    userId!: number;
}