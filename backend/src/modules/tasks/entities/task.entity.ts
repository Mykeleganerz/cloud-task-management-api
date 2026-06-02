/**
 * Task Entity
 * Represents the task model mapped from Prisma schema
 */
export class Task {
    id: number;
    title: string;
    description?: string;
    priority: string;
    status: string;
    dueDate?: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
