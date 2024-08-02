export class CreateMessageDto {
    toSocketId?:string
    parentMessage:string|null
    messageId:string;
    conversationId:string;
    from_userId:string;
    to_userId:string;
    messageContent:string;
    status:number
}
