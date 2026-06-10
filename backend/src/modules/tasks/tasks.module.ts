import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TaskRemindersModule } from 'src/modules/task-reminders/task-reminders.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [DatabaseModule, TaskRemindersModule]
})
export class TasksModule { }
