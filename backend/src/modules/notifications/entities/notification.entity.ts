/**
 * Notification Entity
 * Represents the notification model mapped from Prisma schema
 */
export class Notification {
    id: string;
    userId: string;
    taskId: number;
    title: string;
    dueDate: Date;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
