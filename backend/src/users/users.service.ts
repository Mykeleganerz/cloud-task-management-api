import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { Role } from 'generated/prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

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

  async findAll(role?: Role) {
    if (role) return this.databaseService.user.findMany({
      where: {
        role: role
      }
    });
    return this.databaseService.user.findMany();
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