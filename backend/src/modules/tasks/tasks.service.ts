import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { Priority, Status } from '@prisma/client';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { TaskRemindersService } from '../task-reminders/task-reminders.service';

@Injectable()
export class TasksService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private databaseService: DatabaseService, private taskReminderService: TaskRemindersService) { }

  async create(userId: string, createTaskDto: CreateTaskDto) {
    const task = await this.databaseService.task.create({
      data: {
        ...createTaskDto,
        userId: userId
      }
    });

    let reminderJobId: string | undefined;

    if (createTaskDto.dueDate) {
      try {
        reminderJobId = await this.taskReminderService.remindTask(
          task.id,
          task.title,
          createTaskDto.dueDate,
          userId
        );
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to queue reminder:', message);
      }
    }

    await this.invalidateTaskCache();
    return { ...task, ...(reminderJobId && { reminderJobId }) };
  }

  async findAll(userId: string, priority?: string, status?: string, search?: string, skip: number = 0, take: number = 10) {
    const cacheKey = `tasks:findAll:${userId}:${priority}:${status}:${search}:${skip}:${take}`

    const cached = await this.cacheManager.get(cacheKey)

    if (cached) {
      return cached
    }

    let allData;

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
      allData = {
        data: tasks,
        pagination: { total, skip, take, pages: Math.ceil(total / take) }
      }
    } else if (priority) {
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
      allData = {
        data: tasks,
        pagination: { total, skip, take, pages: Math.ceil(total / take) }
      }
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
      allData = {
        data: tasks,
        pagination: { total, skip, take, pages: Math.ceil(total / take) }
      }
    } else {
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
      allData = {
        data: tasks,
        pagination: { total, skip, take, pages: Math.ceil(total / take) }
      };
    }

    await this.cacheManager.set(cacheKey, allData)

    return allData;
  }

  async findOne(userId: string, id: number) {
    const cacheKey = `tasks:findOne:${userId}:${id}`

    const cached = await this.cacheManager.get(cacheKey)

    if (cached) {
      return cached
    }

    const findTask = await this.databaseService.task.findFirst({
      where: {
        id: id,
        userId: userId
      }
    })

    if (!findTask) {
      throw new NotFoundException("Task in this User is not found.")
    }

    await this.cacheManager.set(cacheKey, findTask)
    return findTask;
  }

  async update(userId: string, id: number, updateTaskDto: UpdateTaskDto) {
    await this.findOne(userId, id)

    const updated = await this.databaseService.task.update({
      where: {
        id: id
      },
      data: {
        ...updateTaskDto
      }
    })

    let reminderJobId: string | undefined;

    // Queue reminder if dueDate was updated
    if (updateTaskDto.dueDate) {
      try {
        reminderJobId = await this.taskReminderService.remindTask(
          updated.id,
          updated.title,
          updateTaskDto.dueDate,
          userId
        );
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to queue reminder:', message);
      }
    }

    await this.cacheManager.del(`tasks:findOne:${userId}:${id}`)
    await this.invalidateTaskCache()
    return { ...updated, ...(reminderJobId && { reminderJobId }) };
  }

  async remove(userId: string, id: number) {
    await this.findOne(userId, id)
    const removed = await this.databaseService.task.delete({
      where: {
        id: id
      }
    })

    await this.cacheManager.del(`tasks:findOne:${userId}:${id}`)
    await this.invalidateTaskCache()
    return removed;
  }

  private async invalidateTaskCache() {
    await this.cacheManager.del('tasks:findAll');
  }
}
