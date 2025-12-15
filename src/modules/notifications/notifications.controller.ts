import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const unread = unreadOnly === 'true';
    return this.notificationsService.findAll(user.id, unread);
  }

  @Get('unread/count')
  async getUnreadCount(@CurrentUser() user: User) {
    const count = await this.notificationsService.findUnreadCount(user.id);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: User) {
    await this.notificationsService.markAllAsRead(user.id);
    return { message: 'All notifications marked as read' };
  }
}
