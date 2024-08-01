import { Module } from '@nestjs/common';
import { ChatAuthService } from './chatAuth.service';
import { ChatAuthController } from './chatAuth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatAuthSchema } from './schema/chatAuth.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:"ChatAuth",schema:ChatAuthSchema}])],
  controllers: [ChatAuthController],
  providers: [ChatAuthService],
  exports:[ChatAuthService]
})
export class ChatAuthModule {}
