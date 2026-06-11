import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { Resend } from "resend";

@Processor('welcome-email-queue')
export class WelcomeEmailProcessor extends WorkerHost {
    private readonly logger = new Logger(WelcomeEmailProcessor.name);
    private resend = new Resend(`${process.env.API_KEY}`);

    async process(job: Job) {
        try {
            const { name, email } = job.data;
            this.logger.log(`Job ${job.id} is being processed.`);

            const data = await this.resend.emails.send({
                from: 'cloud-task-management-api <onboarding@resend.dev>',
                to: [`${email}`],
                subject: 'Welcome!',
                html: `<strong>Welcome New User ${name}!</strong>`,
            });

            this.logger.log(`Successully processed the job ${job.id}`, data);
            return job.data;
        }
        catch (error) {
            this.logger.error(`Failed to process the job ${job.id}`, error);
        }
    }
}