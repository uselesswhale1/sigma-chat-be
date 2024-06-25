import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MessagesModule, UsersModule, ChatsModule, AuthModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
