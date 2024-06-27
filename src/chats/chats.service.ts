import { HttpException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chat } from '@prisma/client';

@Injectable()
export class ChatsService {
  clientToUser: {
    [K in string]: string;
  } = {};

  constructor(private prisma: PrismaService) {}

  identify(clientId: string, userId: string) {
    this.clientToUser[clientId] = userId;

    console.log('chat-service-identify', userId, this.clientToUser);

    return Object.values(this.clientToUser);
  }

  getUserByClient(clientId: string) {
    console.log('chat-service-getUserByClient', clientId, this.clientToUser);

    return this.clientToUser[clientId];
  }

  getClientUserId(userId: string) {
    console.log('chat-service-getClientUserId', userId, this.clientToUser);

    const userSockets = Object.keys(this.clientToUser).filter(
      (k) => this.clientToUser[k] === userId,
    );

    return userSockets;
  }

  removeClient(id: string) {
    delete this.clientToUser[id];

    console.log('chat-service-removeClient', id, this.clientToUser);

    return;
  }

  async create(createChatDto: CreateChatDto) {
    console.log('chat-service-create', createChatDto);

    try {
      const chat = await this.prisma.chat.create({
        data: {
          ...createChatDto,
          participants: [createChatDto.creator],
          lastMessage: '',
        },
      });

      return chat;
    } catch (error) {
      console.log(error);

      throw new HttpException('Failed to create chat', 403);
    }
  }

  async findAll(userId: string): Promise<Chat[]> {
    console.log('chat-service-findAll', userId);

    try {
      const chats = await this.prisma.chat.findMany({
        where: {
          participants: {
            has: userId,
          },
        },
      });

      return chats;
    } catch (error) {
      console.log(error);

      throw new HttpException('Failed to find all', 403);
    }
  }

  async findAllWhereInvited(
    userId: string,
  ): Promise<Pick<Chat, 'name' | 'id'>[]> {
    console.log('chat-service-findAllWhereInvited', userId);

    try {
      const chats = await this.prisma.chat.findMany({
        where: {
          invited: {
            has: userId,
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return chats;
    } catch (error) {
      console.log(error);

      throw new HttpException('Failed to find invited', 403);
    }
  }

  async findOne(chatId: string) {
    console.log('chat-service-findOne', chatId);

    try {
      const chat = await this.prisma.chat.findUnique({
        where: {
          id: chatId,
        },
      });

      return chat;
    } catch (error) {
      console.log(error);

      throw new HttpException('Failed to find one', 403);
    }
  }

  async update(chatId: string, updateChatDto: UpdateChatDto) {
    console.log('chat-service-update', updateChatDto);

    try {
      const chat = await this.prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          ...updateChatDto,
        },
      });

      return chat;
    } catch (error) {
      console.log(error);

      throw new HttpException('Failed to update', 403);
    }
  }

  async remove(chatId: string) {
    console.log('chat-service-remove', chatId);
    try {
      const res = await this.prisma.chat.delete({
        where: {
          id: chatId,
        },
      });

      return res;
    } catch (error) {
      console.log(error);

      throw new HttpException('Failed to remove', 403);
    }
  }
}
