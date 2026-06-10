import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Role } from 'generated/prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async create(createUserDto: CreateUserDto) {
    const password = createUserDto.password.startsWith('$2b$')
      ? createUserDto.password
      : await bcrypt.hash(createUserDto.password, 10);

    const user = await this.databaseService.user.create({
      data: { ...createUserDto, password },
    });

    await this.invalidateUserCache();
    return user;
  }

  async findAll(role?: Role, search?: string, skip: number = 0, take: number = 10) {
    const cacheKey = `users:findAll:${role}:${search}:${skip}:${take}`;

    const cached = await this.cacheManager.get(cacheKey);

    if (cached) return cached;

    let data;

    if (search) {
      const [users, total] = await Promise.all([
        this.databaseService.user.findMany({
          where: { email: { contains: search, mode: 'insensitive' } },
          skip, take,
        }),
        this.databaseService.user.count({
          where: { email: { contains: search, mode: 'insensitive' } },
        }),
      ]);
      data = { data: users, pagination: { total, skip, take, pages: Math.ceil(total / take) } };
    } else if (role) {
      const [users, total] = await Promise.all([
        this.databaseService.user.findMany({ where: { role }, skip, take }),
        this.databaseService.user.count({ where: { role } }),
      ]);
      data = { data: users, pagination: { total, skip, take, pages: Math.ceil(total / take) } };
    } else {
      const [users, total] = await Promise.all([
        this.databaseService.user.findMany({ skip, take }),
        this.databaseService.user.count({}),
      ]);
      data = { data: users, pagination: { total, skip, take, pages: Math.ceil(total / take) } };
    }

    await this.cacheManager.set(cacheKey, data);

    return data;
  }

  async findOne(id: string) {
    const cacheKey = `users:findOne:${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const user = await this.databaseService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User Not Found.');

    await this.cacheManager.set(cacheKey, user);
    return user;
  }

  async findByEmail(email: string) {
    return this.databaseService.user.findFirst({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });

    await this.cacheManager.del(`users:findOne:${id}`);
    await this.invalidateUserCache();
    return user;
  }

  async remove(id: string) {
    const user = await this.databaseService.user.delete({ where: { id } });

    await this.cacheManager.del(`users:findOne:${id}`);
    await this.invalidateUserCache();
    return user;
  }

  private async invalidateUserCache() {
    await this.cacheManager.del('users:findAll');
  }
}