import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, HttpCode } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { Priority, Status } from '@prisma/client';
import { TaskRemindersService } from 'src/modules/task-reminders/task-reminders.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService, private readonly taskReminderService: TaskRemindersService) { }

  @Post()
  create(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.id, createTaskDto);
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
  update(@Req() req, @Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(req.user.id, +id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Req() req, @Param('id') id: string) {
    return this.tasksService.remove(req.user.id, +id);
  }
}
