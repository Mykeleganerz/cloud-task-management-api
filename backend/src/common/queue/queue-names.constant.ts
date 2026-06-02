/**
 * Queue names used throughout the application
 * Centralized constants to avoid typos and inconsistencies
 */
export enum QueueNames {
    TASK_REMINDERS = 'task-reminders',
    USER_QUEUE = 'user-queue', // For future user-related jobs
}

export const QUEUE_JOBS = {
    TASK_REMINDERS: {
        TASK_REMIND_JOB: 'taskRemindJob',
    },
    USER_QUEUE: {
        SEND_WELCOME_EMAIL: 'sendWelcomeEmail',
    },
} as const;
