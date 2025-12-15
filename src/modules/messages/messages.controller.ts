import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body('receiverId') receiverId: string,
    @Body('content') content: string,
    @Body('rideId') rideId?: string,
  ) {
    return this.messagesService.create(user.id, receiverId, content, rideId);
  }

  @Get('conversation/:userId')
  findConversation(
    @CurrentUser() user: User,
    @Param('userId') otherUserId: string,
    @Query('rideId') rideId?: string,
  ) {
    return this.messagesService.findConversation(user.id, otherUserId, rideId);
  }

  @Get('unread/count')
  findUnreadCount(@CurrentUser() user: User) {
    return this.messagesService.findUnreadCount(user.id);
  }

  @Post(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.messagesService.markAsRead(id);
  }
}

