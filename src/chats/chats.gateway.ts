import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
// import { UsersService } from 'src/users/users.service';
import { CLIENT_ENDPOINT } from 'src/utils/constants';
import { SOCKET_PORT } from 'src/utils/constants';

// TODO fix CORS
@WebSocketGateway(SOCKET_PORT, { cors: { origin: CLIENT_ENDPOINT } })
export class ChatsGateway {
  @WebSocketServer()
  private server = new Server();

  constructor(
    private readonly chatsService: ChatsService,
    // private readonly usersService: UsersService,
  ) {}

  @SubscribeMessage('chats')
  async findAll(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const chats = await this.chatsService.findAll(userId); // get all user chats

    this.chatsService.identify(client.id, userId); // assign client to userId

    // join client to rooms where he participates
    const chatIds = chats.map(({ id }) => id);
    client.join([...chatIds, userId]);

    client.emit('chats', chats);

    this.checkInvites(client);

    return 'User got his chats';
  }

  @SubscribeMessage('chat')
  async findOne(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const chat = await this.chatsService.findOne(chatId);

    client.emit('chat', chat);

    console.log('rooms', client.rooms);

    return 'User got his chat';
  }

  // TODO validate invited list and photo url
  @SubscribeMessage('createChat')
  async create(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const req: CreateChatDto = JSON.parse(data); // name, creator, invited, photoUrl

    const chat = await this.chatsService.create(req); // DB create chat

    console.log(chat.invited, chat);

    // emit invite to invited
    chat.invited.forEach((uid) => {
      this.inviteUser(uid);
    });

    const sessions = this.chatsService.getClientUserId(chat.creator);
    this.server.to(sessions).emit('chat', chat); // emit new chat to client

    client.join(chat.id); // join participants to chatroom

    return chat;
  }

  @SubscribeMessage('removeChat')
  async remove(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const req: { userId: string; id: string } = JSON.parse(data);

    const res = await this.chatsService.remove(req.id);

    client.leave(req.id);
    // client.broadcast.to(data.id).emit('messages', []);

    this.findAll(req.userId, client);

    return res;
  }

  @SubscribeMessage('inviteChat')
  async checkInvites(@ConnectedSocket() client: Socket) {
    const userId = this.chatsService.getUserByClient(client.id);

    this.inviteUser(userId);

    // return chats; // 'Client got his invites'
  }

  async inviteUser(id: string) {
    const activeClientSessions = this.chatsService.getClientUserId(id);

    const chats = await this.chatsService.findAllWhereInvited(id); // Pick<Chat, 'name' | 'id'>[]

    this.server.to(activeClientSessions).emit('inviteChat', chats);
  }

  @SubscribeMessage('joinChat')
  async join(@MessageBody() id: string, @ConnectedSocket() client: Socket) {
    // find user sockets
    const userId = this.chatsService.getUserByClient(client.id);
    const userSessions = this.chatsService.getClientUserId(userId);

    // find chat to .
    const { participants, invited } = await this.chatsService.findOne(id);

    // fix chat invited (remove user)
    // fix chat participants (add user)
    const updatedChat = await this.chatsService.update(id, {
      invited: invited.filter((id) => id !== userId),
      participants: [...participants, userId],
    });

    // fix users chats (add new)
    this.server.to(userSessions).emit('chat', updatedChat);

    // fix user invites (remove accepted)
    this.checkInvites(client);

    return 'Client got his invites';
  }

  // TODO clear clientToUser list
  @SubscribeMessage('disconnectSocket')
  async disconnect(
    // @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    this.chatsService.removeClient(client.id);

    return 'User got his chat';
  }
}
