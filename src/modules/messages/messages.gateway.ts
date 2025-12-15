import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';
import { User } from '../../entities/user.entity';

interface AuthenticatedSocket extends Socket {
  user?: User;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/messages',
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private messagesService: MessagesService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.user = { id: payload.sub } as User;
      this.connectedUsers.set(client.user.id, client.id);
      
      // Join user's personal room
      client.join(`user:${client.user.id}`);
      
      console.log(`User ${client.user.id} connected to messaging`);
    } catch (error) {
      console.error('WebSocket authentication error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.user) {
      this.connectedUsers.delete(client.user.id);
      console.log(`User ${client.user.id} disconnected from messaging`);
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { receiverId: string; content: string; rideId: string },
  ) {
    if (!client.user) {
      return { error: 'Unauthorized' };
    }

    try {
      // Validate that ride is accepted by both parties
      const canMessage = await this.messagesService.canSendMessage(
        client.user.id,
        data.receiverId,
        data.rideId,
      );

      if (!canMessage) {
        return { error: 'Messages can only be sent when ride is accepted by both parties' };
      }

      // Create message
      const message = await this.messagesService.create(
        client.user.id,
        data.receiverId,
        data.content,
        data.rideId,
      );

      // Emit to receiver if online
      const receiverSocketId = this.connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('new_message', message);
      }

      // Also emit to sender for confirmation
      client.emit('message_sent', message);

      return { success: true, message };
    } catch (error) {
      console.error('Error sending message:', error);
      return { error: error.message || 'Failed to send message' };
    }
  }

  @SubscribeMessage('join_ride_room')
  async handleJoinRideRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { rideId: string },
  ) {
    if (!client.user) {
      return { error: 'Unauthorized' };
    }

    client.join(`ride:${data.rideId}`);
    return { success: true };
  }

  @SubscribeMessage('leave_ride_room')
  async handleLeaveRideRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { rideId: string },
  ) {
    if (!client.user) {
      return { error: 'Unauthorized' };
    }

    client.leave(`ride:${data.rideId}`);
    return { success: true };
  }

  // Helper method to emit message to specific user
  emitToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }
}


