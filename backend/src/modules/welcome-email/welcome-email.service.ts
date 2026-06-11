import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class WelcomeEmailService {
    private readonly logger = new Logger(WelcomeEmailService.name);

    constructor(@InjectQueue('welcome-email-queue') private welcomeEmailQueue: Queue) { }

    async welcomeEmail(name: string, email: string) {
        try {
            const job = await this.welcomeEmailQueue.add(
                'welcome-email-job',
                { name, email },
                { attempts: 3, removeOnComplete: true }
            );

            this.logger.log(`Job ${job.id} added to the queue.`);
            return job.id;
        }
        catch (error) {
            this.logger.error(`Failed to add the job for ${email} to the queue.`, error);
        }
    }
}
