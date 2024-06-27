import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { ChatsService } from './chats.service';

@Module({
  imports: [PrismaModule, UsersModule, ChatsModule],
  providers: [ChatsGateway, ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
