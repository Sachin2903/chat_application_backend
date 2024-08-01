import { Injectable } from '@nestjs/common';
import { CreateChatAuthDto } from './dto/create-chatauth.dto';
import { UpdateChatAuthDto } from './dto/update-chatauth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ChatAuth } from './schema/chatAuth.schema';
import * as mongoose from "mongoose";
@Injectable()
export class ChatAuthService {
  constructor(@InjectModel(ChatAuth.name) private chatAuthModel: mongoose.Model<ChatAuth>) { }


  async CheckAndUpdateUser(userId: string, socketId: string) {
    try {
      // await this.chatAuthModel.findByIdAndUpdate(userId,{$set:{sId:socketId,status:true}},{new:true,upsert:true})


    } catch (error) {
      console.log(error, "unable to create user")
    }
  }

  async changeUserOnlineStatus(socketId: string,date:Date) {
    try {
      // await this.chatAuthModel.findOneAndUpdate({sId:socketId},{$set:{lastSeen:date,status:false}})

    } catch (error) {
      console.log(error, "unable to make user offline/disconnected")
    }

  }
  create(createAuthDto: CreateChatAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateChatAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
