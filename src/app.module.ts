
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConversationModule } from './conversation/conversation.module';
import { ChatAuthModule } from './chatAuth/chatAuth.module';

import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from './message/message.module';
import { ChatGateway } from './chatGateway/chat-gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath:".env",
    isGlobal:true
  }), JwtModule.register({}),ConversationModule, ChatAuthModule , MongooseModule.forRoot(process.env.MONGO_URL), MessageModule
  ],
  controllers: [AppController],
  providers: [AppService,ChatGateway],
})

export class AppModule {
  constructor(){
    console.log('Mongo URL:', process.env.MONGO_URL)
  }
}
