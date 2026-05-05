import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  create(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.id, createTaskDto);
  }

  @Get()
  findAll(@Req() req) {
    return this.tasksService.findAll(req.user.id);
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
  remove(@Req() req, @Param('id') id: string) {
    return this.tasksService.remove(req.user.id, +id);
  }
}
