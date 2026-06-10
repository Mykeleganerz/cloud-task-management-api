import { Module } from '@nestjs/common';
import { TaskRemindersService } from './task-reminders.service';
import { TaskRemindersProcessor } from './processors/task-reminders.processor';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'task-reminders',
        }),
        NotificationsModule
    ],
    providers: [TaskRemindersService, TaskRemindersProcessor],
    exports: [TaskRemindersService]
})
export class TaskRemindersModule { }
