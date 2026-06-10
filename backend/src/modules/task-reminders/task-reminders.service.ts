import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class TaskRemindersService {
    private readonly logger = new Logger(TaskRemindersService.name);

    constructor(@InjectQueue('task-reminders') private readonly reminderQueue: Queue) { }

    async remindTask(taskId: number, title: string, dueDate: Date, userId: string) {
        try {
            // Calculate delay until dueDate (test change user commit)
            const delayMs = new Date(dueDate).getTime() - Date.now();

            const job = await this.reminderQueue.add(
                'taskRemindJob',
                { taskId, title, dueDate, userId },
                {
                    attempts: 3,
                    removeOnComplete: true,
                    delay: Math.max(delayMs - (60 * 60 * 1000), 0)  // Schedule for due date, 1 hour before due date
                }
            );

            const scheduledTime = new Date(dueDate).toLocaleString();
            this.logger.log(`Job ${job.id} scheduled for task "${title}" at ${scheduledTime}`);
            return job.id;
        }
        catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to queue reminder for task ${taskId}: ${message}`);
            throw error;
        }
    }
}
