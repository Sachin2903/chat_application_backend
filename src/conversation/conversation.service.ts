import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './schema/conversation.schema';
import * as mongoose from "mongoose";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ConversationService {
  constructor(@InjectModel(Conversation.name) private conversationModel: mongoose.Model<Conversation>,
    private readonly jwtService: JwtService,) { }
  async create(createConversationDto: CreateConversationDto) {
    try {
      await this.conversationModel.findOneAndUpdate({ userId: createConversationDto.userId, serviceUserId: createConversationDto.serviceUserId }, { $set: createConversationDto }, { upsert: true })
      console.log("a new connection created successfully")
    } catch (error) {
      const message = error.response && typeof error.response == "string" ? error.response : error.message && typeof error.message == "string" ? error.message : "Internal Server Error"
      throw new HttpException(message, HttpStatus.FORBIDDEN)
    }
  }

  async findAllConversation(accessToken: string) {
    try {
      const decodeToken: any = await this.jwtService.decode(accessToken as string)
      if (!decodeToken?.Id) {
        throw new HttpException("Conflict in accessToken , UserId Not Found!", HttpStatus.FORBIDDEN)
      }

      return await this.conversationModel.aggregate([
        { $match: { $or: [{ userId: decodeToken?.Id }, { serviceUserId: decodeToken?.Id }] } },
        { $sort: { updatedAt: -1 } },
        {
          $lookup: {
            from: 'chatauths',
            localField: 'userId',
            foreignField: 'userId',
            as: 'userDetails'
          }
        },
        {
          $unwind: {
            path: '$userDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'chatauths',
            localField: 'serviceUserId',
            foreignField: 'userId',
            as: 'serviceUserDetails'
          }
        },
        {
          $unwind: {
            path: '$serviceUserDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'messages',
            localField: 'conversationId',
            foreignField: '_id',
            as: 'messages'
          }
        },
        {
          $addFields: {
            messages: {
              $sortArray: {
                input: '$messages',
                sortBy: { createdAt: 1 }
              }
            }
          }
        },
      ])

    } catch (error) {
      const message = error.response && typeof error.response == "string" ? error.response : error.message && typeof error.message == "string" ? error.message : "Internal Server Error"
      throw new HttpException(message, HttpStatus.FORBIDDEN)
    }
  }

  async updateConversationUpdatedAt(conversationId){
    try {
      await this.conversationModel.findByIdAndUpdate(conversationId,{updatedAt:new Date()})
    } catch (error) {
      console.log(error,"fail to update updatedAt")
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
