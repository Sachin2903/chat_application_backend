import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps:true})
export class Conversation{
    @Prop({type:String,required:true})
    userId:string;

    @Prop({type:String,required:true})
    serviceUserId:string;

    @Prop({type:Number,default:0})
    conversationStatus:number

}

export const ConversationSchema=SchemaFactory.createForClass(Conversation)