import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class ChatAuth {

    @Prop(({ type: String, required: true }))
    userId: string

    @Prop(({ type: String, required: true }))
    name: string

    @Prop(({ type: String, required: true }))
    email: string

    @Prop(({ type: String, required: true }))
    sId: string

    @Prop(({ type: Date, default : new Date() }))
    lastSeen: Date

    @Prop(({ type: String }))
    type: string

    @Prop(({ type: String }))
    source: string

    @Prop(({ type: Boolean, default: true }))
    isNotificationOn: boolean

    @Prop(({ type: Boolean, default: true }))
    status: boolean

}

export const ChatAuthSchema=SchemaFactory.createForClass(ChatAuth)