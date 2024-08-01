import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps:true})
export class Message{
   @Prop({type:[String,null],default:null})
   parentMessage:string|null

   @Prop({type:String})
   conversationId:string;

   @Prop({type:String})
   from_userId:string;

   @Prop({type:String})
   to_userId:string;

   @Prop({type:String})
   messageContent:string;

   @Prop({type:Number,default:0})
   status:number

}
export const MessageSchema=SchemaFactory.createForClass(Message)