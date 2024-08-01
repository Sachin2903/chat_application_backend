import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { ChatAuthService } from 'src/chatAuth/chatAuth.service';
import { MessageService } from 'src/message/message.service';

const port = 3636;
@WebSocketGateway({ cors: { origin: "*", method: ["GET", "POST"], credentials: true } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly jwtService: JwtService,
        @Inject(ChatAuthService) private readonly chatAuthService: ChatAuthService,
        @Inject(MessageService) private readonly messageService: MessageService
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
            if (!decodeToken?.sub) {
                console.log(`Client disconnected: ${client.id} Due to invalid user Id`)
                client.disconnect();
            } else {
                console.log(`Client connected: ${client.id}`);
                client.broadcast.emit("online-connected", { userId: decodeToken?.sub, socketId: client.id })
                await Promise.all([this.chatAuthService.CheckAndUpdateUser(decodeToken?.sub, client.id), this.messageService.makeAllConversationStatusSend(decodeToken?.sub)])
            }
        }
    }

    async handleDisconnect(client: Socket) {
        if (client.id){
            const date=new Date()
            client.broadcast.emit("offline-disconnect", {socketId: client.id,lastSeen:date })
            await this.chatAuthService.changeUserOnlineStatus(client.id,date)
        }
        
        console.log(`Client disconnected: ${client.id}`);
    }




}

