import { Module } from '@nestjs/common';
import { WelcomeEmailService } from './welcome-email.service';
import { BullModule } from '@nestjs/bullmq';
import { WelcomeEmailProcessor } from './processor/welcome-email-processor';

@Module({
  imports: [BullModule.registerQueue({
    name: 'welcome-email-queue'
  })],
  providers: [WelcomeEmailService, WelcomeEmailProcessor],
  exports: [WelcomeEmailService]
})
export class WelcomeEmailModule { }
