import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { Role } from 'generated/prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createUserDto: CreateUserDto) {
    const password = createUserDto.password.startsWith('$2b$')
      ? createUserDto.password
      : await bcrypt.hash(createUserDto.password, 10);

    return this.databaseService.user.create({
      data: {
        ...createUserDto,
        password,
      }
    });
  }

  async findAll(role?: Role, search?: string, skip: number = 0, take: number = 10) {
    if (search) {
      const [users, total] = await Promise.all([
        this.databaseService.user.findMany({
          where: {
            email: {
              contains: search,
              mode: 'insensitive'
            }
          },
          skip,
          take
        }),
        this.databaseService.user.count({
          where: {
            email: {
              contains: search,
              mode: 'insensitive'
            }
          }
        })
      ]);
      return {
        data: users,
        pagination: { total, skip, take, pages: Math.ceil(total / take) }
      };
    }

    else if (role) {
      const [users, total] = await Promise.all([
        this.databaseService.user.findMany({
          where: {
            role: role
          },
          skip,
          take
        }),
        this.databaseService.user.count({
          where: {
            role: role
          }
        })
      ]);
      return {
        data: users,
        pagination: { total, skip, take, pages: Math.ceil(total / take) }
      };
    }
    const [users, total] = await Promise.all([
      this.databaseService.user.findMany({
        skip,
        take
      }),
      this.databaseService.user.count({})
    ]);
    return {
      data: users,
      pagination: { total, skip, take, pages: Math.ceil(total / take) }
    };
  }

  async findOne(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        id,
      }
    });

    if (!user) {
      throw new NotFoundException("User Not Found.")
    }
    return user
  }

  async findByEmail(email: string) {
    return this.databaseService.user.findFirst({
      where: {
        email: email
      }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto
    });
  }

  async remove(id: string) {
    return this.databaseService.user.delete({
      where: {
        id,
      }
    });
  }

}