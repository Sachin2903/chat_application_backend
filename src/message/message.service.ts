import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/message.conversation';
import * as mongoose from "mongoose";

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: mongoose.Model<Message>) { }

  async makeAllConversationStatusSend(userId:string) {
    try {
      // await this.messageModel.updateMany({to_userId:userId}, {$set:{status:1}})
    } catch (error) {
      console.log(error, "fail to update message status to send")
    }
  }
  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
