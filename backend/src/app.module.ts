import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { BullModule } from '@nestjs/bullmq';
import { TaskRemindersModule } from './modules/task-reminders/task-reminders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WelcomeEmailModule } from './modules/welcome-email/welcome-email.module';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    TasksModule,
    TaskRemindersModule,
    NotificationsModule,
    WelcomeEmailModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        stores: [
          new KeyvRedis(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`),
        ],
        ttl: parseInt(process.env.REDIS_TTL!),
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'redis',
        port: parseInt(process.env.REDIS_PORT ?? '6379')
      },
      defaultJobOptions: { attempts: 3 }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }