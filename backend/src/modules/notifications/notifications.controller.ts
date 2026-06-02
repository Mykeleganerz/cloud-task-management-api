import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendReminderDto } from './dto/send-reminder.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post('send-reminder')
    async sendReminder(@Body() sendReminderDto: SendReminderDto) {
        return await this.notificationsService.sendReminder(sendReminderDto);
    }

    @Get()
    async getNotifications(@Req() req) {
        return await this.notificationsService.getNotifications(req.user.id);
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: number) {
        return await this.notificationsService.markAsRead(+id);
    }
}
