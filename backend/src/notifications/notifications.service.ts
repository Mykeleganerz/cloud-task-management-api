import { Injectable, Logger } from '@nestjs/common';
import { SendReminderDto } from './dto/send-reminder.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(private readonly databaseService: DatabaseService) { }

    async sendReminder(reminderDto: SendReminderDto): Promise<{ success: boolean; message: string }> {
        const { taskId, title, dueDate, userId } = reminderDto;

        this.logger.log(`📧 Creating reminder notification for task "${title}" (ID: ${taskId})`);

        try {
            // Save reminder to notifications table
            const notification = await this.databaseService.notification.create({
                data: {
                    userId,
                    taskId,
                    title,
                    dueDate,
                    isRead: false
                }
            });

            this.logger.log(`✅ Reminder saved (ID: ${notification.id}) for task "${title}"`);

            return {
                success: true,
                message: `Reminder created for task "${title}"`
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to create reminder notification: ${message}`);
            throw error;
        }
    }

    async getNotifications(userId: string) {
        try {
            const notifications = await this.databaseService.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { email: true } } }
            });

            return {
                success: true,
                data: notifications
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to fetch notifications: ${message}`);
            throw error;
        }
    }

    async markAsRead(notificationId: number) {
        try {
            const notification = await this.databaseService.notification.update({
                where: { id: notificationId },
                data: { isRead: true }
            });

            return {
                success: true,
                data: notification
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to mark notification as read: ${message}`);
            throw error;
        }
    }
}
