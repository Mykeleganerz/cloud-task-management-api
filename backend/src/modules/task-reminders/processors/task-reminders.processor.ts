import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationsService } from 'src/modules/notifications/notifications.service';

@Processor('task-reminders')
export class TaskRemindersProcessor extends WorkerHost {
    private readonly logger = new Logger(TaskRemindersProcessor.name);

    constructor(private readonly notificationsService: NotificationsService) {
        super();
    }

    async process(job: Job): Promise<any> {
        const { taskId, title, dueDate, userId } = job.data;

        this.logger.log(`Processing reminder for task ${taskId}: "${title}"`);

        try {
            // Send notification via NotificationsService
            const result = await this.notificationsService.sendReminder({
                taskId,
                title,
                dueDate,
                userId
            });

            this.logger.log(`Reminder processed successfully for task ${taskId}`);
            return { ...result, taskId, title };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            const stack = error instanceof Error ? error.stack : '';
            this.logger.error(`Failed to process reminder for task ${taskId}: ${message}`, stack);
            throw error; // BullMQ will retry based on job config
        }
    }
}
