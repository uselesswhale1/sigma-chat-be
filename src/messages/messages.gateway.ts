import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { Message } from '@prisma/client';
// import { UsersService } from 'src/users/users.service';
import { ChatsService } from 'src/chats/chats.service';
import { SOCKET_PORT, CLIENT_ENDPOINT } from 'src/utils/constants';

@WebSocketGateway(SOCKET_PORT, {
  cors: {
    origin: CLIENT_ENDPOINT,
  },
})
export class MessagesGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly chatsService: ChatsService,
    // private readonly usersService: UsersService,
  ) {}

  @SubscribeMessage('messages')
  async findAll(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.messagesService.findAll(chatId); // DB get chat messages

    const modifiedMessages =
      await this.messagesService.fixMessageCreator(messages);

    // send messages to client
    client.emit('messages', modifiedMessages);

    return modifiedMessages;
  }

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() payload: string,
    @ConnectedSocket() client: Socket,
  ): Promise<Message> {
    // handle new message in chat
    const createMessageDto = JSON.parse(payload); // content, creator, chatId

    this.chatsService.identify(client.id, createMessageDto.creator);

    const userId = this.chatsService.getUserByClient(client.id);

    // DB message create
    const message = await this.messagesService.create({
      ...createMessageDto,
      creator: userId,
    });

    // DB chat update 'lastMessage'
    const updatedChat = await this.chatsService.update(message.chatId, {
      lastMessage: message.content,
    });

    // emit message to chat participants, including the creator
    const [fixedMessage] = await this.messagesService.fixMessageCreator([
      message,
    ]);

    // emit changes chat (lastMessage)
    this.server.to(updatedChat.participants).emit('chat', updatedChat);

    // emit new message to participants
    this.server.to(updatedChat.participants).emit('message', fixedMessage);

    return message;
  }

  // @SubscribeMessage('updateMessage')
  // update(@MessageBody() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  // }

  // @SubscribeMessage('removeMessage')
  // remove(@MessageBody() id: number) {
  //   return this.messagesService.remove(id);
  // }

  // @SubscribeMessage('join')
  // joinRoom(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
  //   return this.messagesService.identify(name, client.id);
  // }

  // @SubscribeMessage('typing')
  // async typing(@MessageBody('isTyping') isTyping: boolean, @ConnectedSocket() client: Socket) {
  //   const name = await this.messagesService.getClientName(client.id)

  //   client.broadcast.emit('typing', { name, isTyping })

  //   // return this.messagesService.findAll();
  // }
}
