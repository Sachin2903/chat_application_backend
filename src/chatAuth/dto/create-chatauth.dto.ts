export class CreateChatAuthDto {
    userId: string
    sId: string
    lastSeen: Date
    type: string
    source: string
    isNotificationOn: boolean
    status:boolean
    email:string
    name:string
    profile?:string
}
