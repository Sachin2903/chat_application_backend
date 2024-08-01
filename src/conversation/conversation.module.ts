import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationSchema } from './schema/conversation.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:"Conversation",schema:ConversationSchema}])],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
