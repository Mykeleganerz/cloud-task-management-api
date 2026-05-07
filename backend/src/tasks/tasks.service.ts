import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { Priority, Status } from 'generated/prisma/client';
import { contains } from 'class-validator';

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

  async findAll(userId: string, priority?: string, status?: string, search?: string, skip: number = 0, take: number = 10) {
    if (search) {
      const [tasks, total] = await Promise.all([
        this.databaseService.task.findMany({
          where: {
            userId: userId,
            title: {
              contains: search, mode: 'insensitive'
            }
          },
          skip,
          take
        }),
        this.databaseService.task.count({
          where: {
            userId: userId,
            title: {
              contains: search, mode: 'insensitive'
            }
          }
        })
      ]);
      return {
        data: tasks,
        pagination: { total, skip, take, pages: Math.ceil(total / take) }
      };
    }

    if (priority) {
      const [tasks, total] = await Promise.all([
        this.databaseService.task.findMany({
          where: {
            userId: userId,
            priority: priority as Priority
          },
          skip,
          take
        }),
        this.databaseService.task.count({
          where: {
            userId: userId,
            priority: priority as Priority
          }
        })
      ]);
      return {
        data: tasks,
        pagination: { total, skip, take, pages: Math.ceil(total / take) }
      };
    }
    else if (status) {
      const [tasks, total] = await Promise.all([
        this.databaseService.task.findMany({
          where: {
            userId: userId,
            status: status as Status
          },
          skip,
          take
        }),
        this.databaseService.task.count({
          where: {
            userId: userId,
            status: status as Status
          }
        })
      ]);
      return {
        data: tasks,
        pagination: { total, skip, take, pages: Math.ceil(total / take) }
      };
    }
    const [tasks, total] = await Promise.all([
      this.databaseService.task.findMany({
        where: {
          userId: userId
        },
        skip,
        take
      }),
      this.databaseService.task.count({
        where: {
          userId: userId
        }
      })
    ]);
    return {
      data: tasks,
      pagination: { total, skip, take, pages: Math.ceil(total / take) }
    };
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
