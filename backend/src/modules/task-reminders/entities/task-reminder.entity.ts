/**
 * TaskReminder Entity
 * Represents the task reminder job data
 */
export class TaskReminder {
    taskId: number;
    title: string;
    dueDate: Date;
    userId: string;
    reminderJobId?: string;
}
