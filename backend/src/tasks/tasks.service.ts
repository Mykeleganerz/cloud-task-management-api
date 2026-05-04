import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { Priority, Status } from 'generated/prisma';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createTaskDto: CreateTaskDto) {
    return this.databaseService.task.create({
      data: createTaskDto
    });
  }

  async findAll(prio?: Priority, status?: Status) {
    return this.databaseService.task.findMany({
      where: {
        priority: prio,
        status: status
      }
    });
  }

  async findOne(id: number) {
    return this.databaseService.task.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.databaseService.task.update({
      where: {
        id,
      },
      data: updateTaskDto
    });
  }

  async remove(id: number) {
    return this.databaseService.task.delete({
      where: {
        id,
      }
    });
  }
}
