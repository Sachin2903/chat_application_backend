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
      const conversation = await this.conversationModel.findOneAndUpdate({ userId: createConversationDto.userId, serviceUserId: createConversationDto.serviceUserId }, { $set: { ...createConversationDto } }, { upsert: true,new: true })
      console.log("a new connection created successfully")
      return conversation?._id;
    } catch (error) {
      const message = error.response && typeof error.response == "string" ? error.response : error.message && typeof error.message == "string" ? error.message : "Internal Server Error"
      throw new HttpException(message, HttpStatus.FORBIDDEN)
    }
  }

  async findAllConversation(userid: string) {
    try {
      if (!userid) {
        throw new HttpException("Conflict in accessToken , UserId Not Found!", HttpStatus.FORBIDDEN)
      }

     const conversation= await this.conversationModel.aggregate([
        { $match: { $or: [{ userId: userid }, { serviceUserId: userid }] } },
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
        // {
        //   $unwind: {
        //     path: '$serviceUserDetails',
        //     preserveNullAndEmptyArrays: true
        //   }
        // },
        // {
        //   $addFields: {
        //     conversationIdString: { $toString: "$_id" }
        //   }
        // },
        // {
        //   $lookup: {
        //     from: 'messages',
        //     localField: 'conversationId',
        //     foreignField: "conversationIdString",
        //     as: 'messages'
        //   }
        // },
        // {
        //   $addFields: {
        //     messages: {
        //       $sortArray: {
        //         input: '$messages',
        //         sortBy: { createdAt: 1 }
        //       }
        //     }
        //   }
        // },

      ])


      console.log(conversation)
      return []
    } catch (error) {
      const message = error.response && typeof error.response == "string" ? error.response : error.message && typeof error.message == "string" ? error.message : "Internal Server Error"
      throw new HttpException(message, HttpStatus.FORBIDDEN)
    }
  }

  async updateConversationUpdatedAt(conversationId) {
    try {
      await this.conversationModel.findByIdAndUpdate(conversationId, { updatedAt: new Date() })
      console.log("updated conversation updateAt value")
    } catch (error) {
      console.log(error, "fail to update updatedAt in conversation")
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
