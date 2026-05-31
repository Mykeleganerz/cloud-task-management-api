import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendReminderDto {
    @IsNotEmpty()
    @IsNumber()
    taskId: number = 0;

    @IsNotEmpty()
    @IsString()
    title: string = '';

    @IsNotEmpty()
    @IsDate()
    dueDate: Date = new Date();

    @IsNotEmpty()
    @IsString()
    userId: string = '';
}
