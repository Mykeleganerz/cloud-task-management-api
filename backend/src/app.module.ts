import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [UsersModule, DatabaseModule, AuthModule, TasksModule, CacheModule.register({
    isGlobal: true,
  })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
