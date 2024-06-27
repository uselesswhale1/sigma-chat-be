import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  clientToUser = {};

  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  create(createMessageDto: CreateMessageDto): Promise<Message> {
    console.log('messages-service-create', createMessageDto);

    return this.prisma.message.create({
      data: {
        ...createMessageDto,
      },
    });
  }

  findAll(id: string) {
    console.log('messages-service-findAll', id);

    return this.prisma.message.findMany({
      where: {
        chatId: { equals: id },
      },
    });
  }

  async fixMessageCreator(messages: Message[]) {
    const creatorIds = messages.map((m) => m.creator);

    const creators = await this.usersService.findAll(creatorIds);

    const modifiedMessages = messages.map((msg) => {
      // @ts-ignore
      msg['creator'] = creators.find(({ id, name, photoUrl }) => {
        if (id === msg.creator) {
          return { id, name, photoUrl };
        }
      });

      return msg;
    });

    return modifiedMessages;
  }

  // identify(name: string, clientId: string) {
  //   this.clientToUser[clientId] = name;

  //   return Object.values(this.clientToUser)
  // }

  // getClientName(clientId: string) {
  //   return this.clientToUser[clientId]
  // }

  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} message`;
  // }
}
