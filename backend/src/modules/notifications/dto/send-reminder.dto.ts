import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendReminderDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    taskId: number = 0;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string = '';

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    dueDate: Date = new Date();

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userId: string = '';
}
