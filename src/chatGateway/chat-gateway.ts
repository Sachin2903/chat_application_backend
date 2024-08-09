import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { ChatAuthService } from 'src/chatAuth/chatAuth.service';
import { MessageService } from 'src/message/message.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { ConversationService } from 'src/conversation/conversation.service';

const port = 3636;
@WebSocketGateway({ cors: { origin: "*", method: ["GET", "POST"], credentials: true } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly jwtService: JwtService,
        @Inject(ChatAuthService) private readonly chatAuthService: ChatAuthService,
        @Inject(MessageService) private readonly messageService: MessageService,
        @Inject(ConversationService) private readonly conversationService: ConversationService
    ) { }

    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.log(`---------------------socket io--------------------------\n socket server started at port: ${port}\n ---------------------socket io--------------------------`)
    }

    async handleConnection(client: Socket, ...args: any[]) {
        const access_token = client.handshake.headers['authorization'];
        if (!access_token) {
            console.log(`Client disconnected: ${client.id} Due to invalid accessToken`)
            client.disconnect();
        } else {
            const decodeToken: any = await this.jwtService.decode(access_token as string)
            console.log(decodeToken)
            if (!decodeToken?.sub || !decodeToken?.Id) {
                console.log(`Client disconnected: ${client.id} Due to invalid user Id`)
                client.disconnect();
            } else {
                console.log(`Client connected: ${client.id}`);
                client.broadcast.emit("online-connected", { userId: decodeToken?.Id, socketId: client.id, type: decodeToken?.authorities[0] ? decodeToken?.authorities[0] : "UNKNOWN", })

                await Promise.all([this.chatAuthService.CheckAndUpdateUser(decodeToken?.Id, {
                    sId: client.id,
                    type: decodeToken?.authorities[0] ? decodeToken?.authorities[0] : "UNKNOWN",
                    source: decodeToken?.officeId,
                    lastSeen: new Date(),
                    status: true,
                    email: decodeToken?.sub,
                    name: decodeToken?.name
                }), this.messageService.makeAllConversationStatusSend(decodeToken?.Id)])
            }
        }
    }

    async handleDisconnect(client: Socket) {
        if (client.id) {
            const date = new Date()
            client.broadcast.emit("offline-disconnect", { socketId: client.id, lastSeen: date })
            await this.chatAuthService.changeUserOnlineStatus(client.id, date)
        }else {
            console.log("invalid client Id When Disconnect")
        }
        console.log(`Client disconnected: ${client.id}`);



    }


    @SubscribeMessage('chat-message')
    async handleMessage(client: Socket, @MessageBody() messageObject): Promise<void> {
        const toSocketId = messageObject?.toSocketId.toString()
        delete messageObject.toSocketId
        
        if (toSocketId) {
            this.server.to(toSocketId).emit("receive-message", messageObject);
        } else {
            console.error("toSocketId is not defined");
        }
        await Promise.all([this.messageService.addConversationMessage(messageObject), this.conversationService.updateConversationUpdatedAt(messageObject?.conversationId)])
    }

    @SubscribeMessage('chat-typing')
    async handleMessageTyping(client: Socket, @MessageBody() typingObject: {
        conversationId: string, userId: string;
        to_userId_socketId: string
    }): Promise<void> {
        if (typingObject?.to_userId_socketId) {
            const toSendObject = { ...typingObject }
            delete toSendObject.to_userId_socketId
            this.server.to(typingObject?.to_userId_socketId).emit("server-chat-typing", toSendObject)
            await this.chatAuthService.changeTypingStatus({ conversationId: typingObject?.conversationId, userId: typingObject?.userId, status: true })
        } else {
            console.log("Invalid to_userId_socketId  value")
        }
    }

    @SubscribeMessage('chat-stop-typing')
    async handleMessageStopTyping(client: Socket, @MessageBody() typingObject: {
        conversationId: string, userId: string;
        to_userId_socketId: string
    }): Promise<void> {
        if (typingObject?.to_userId_socketId) {
            const toSendObject = { ...typingObject }
            delete toSendObject.to_userId_socketId
            this.server.to(typingObject?.to_userId_socketId).emit("server-chat-stop-typing", toSendObject)
            await this.chatAuthService.changeTypingStatus({ conversationId: typingObject?.conversationId, userId: typingObject?.userId, status: false })
        } else {
            console.log("Invalid to_userId_socketId  value")
        }

    }

    @SubscribeMessage('chat-message-seen')
    async messageSeen(client: Socket, @MessageBody() messageSeenObject: { to_userId: string, conversationId: string, from_socketId: string }): Promise<void> {
        const socketId = messageSeenObject?.from_socketId
        delete messageSeenObject?.from_socketId

        if (!socketId||!messageSeenObject?.to_userId) {
            this.server.to(socketId).emit("chat-message-seen-server", messageSeenObject)
            await this.messageService.makeConversationMessageSeen(messageSeenObject?.conversationId, messageSeenObject?.to_userId)
        } else {
            console.log("invalid socket id or to user id")
        }
    }
}

