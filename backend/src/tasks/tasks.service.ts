import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TasksService {
  constructor(private databaseService: DatabaseService) { }

  async create(userId: string, createTaskDto: CreateTaskDto) {
    return this.databaseService.task.create({
      data: {
        ...createTaskDto,
        userId: userId
      }
    })
  }

  async findAll(userId: string) {
    return this.databaseService.task.findMany({
      where: {
        userId: userId
      }
    });
  }

  async findOne(userId: string, id: number) {
    const findTask = await this.databaseService.task.findFirst({
      where: {
        id: id,
        userId: userId
      }
    })

    if (!findTask) {
      throw new NotFoundException("Task in this User is not found.")
    }
    return findTask;
  }

  async update(userId: string, id: number, updateTaskDto: UpdateTaskDto) {
    await this.findOne(userId, id)

    return this.databaseService.task.update({
      where: {
        id: id
      },
      data: {
        ...updateTaskDto
      }
    })
  }

  async remove(userId: string, id: number) {
    await this.findOne(userId, id)
    return this.databaseService.task.delete({
      where: {
        id: id
      }
    })
  }
}
