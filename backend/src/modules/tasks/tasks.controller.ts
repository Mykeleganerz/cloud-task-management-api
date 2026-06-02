import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { Priority, Status } from 'generated/prisma/client';
import { TaskRemindersService } from 'src/modules/task-reminders/task-reminders.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService, private readonly taskReminderService: TaskRemindersService) { }

  @Post()
  async create(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    // 1. Create task first
    const task = await this.tasksService.create(req.user.id, createTaskDto);

    // 2. Queue reminder job if dueDate is provided
    if (createTaskDto.dueDate) {
      try {
        const jobId = await this.taskReminderService.remindTask(
          task.id,
          task.title,
          createTaskDto.dueDate,
          req.user.id
        );
        return { ...task, reminderJobId: jobId };
      } catch (error: unknown) {
        // Task is created but reminder failed - log but don't fail the request
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to queue reminder:', message);
        return task;
      }
    }

    return task;
  }

  @Get()
  findAll(@Req() req, @Query('priority') priority?: string, @Query('status') status?: string, @Query('search') search?: string, @Query('skip') skip?: string, @Query('take') take?: string) {
    return this.tasksService.findAll(req.user.id, priority as Priority, status as Status, search, skip ? parseInt(skip) : 0, take ? parseInt(take) : 10);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: number) {
    return this.tasksService.findOne(req.user.id, +id);
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    // Update task
    const task = await this.tasksService.update(req.user.id, +id, updateTaskDto);

    // Queue reminder if dueDate was updated
    if (updateTaskDto.dueDate) {
      try {
        const jobId = await this.taskReminderService.remindTask(
          task.id,
          task.title,
          updateTaskDto.dueDate,
          req.user.id
        );
        return { ...task, reminderJobId: jobId };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to queue reminder:', message);
        return task;
      }
    }

    return task;
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.tasksService.remove(req.user.id, +id);
  }
}
