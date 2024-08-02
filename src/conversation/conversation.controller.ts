import { Controller,Headers, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('/createconversation')
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto);
  }

  @Get("/all-conversation")
  getAllConversation(@Headers('authorization') authHeader: string) {
    if(!authHeader.slice(7).trim()||authHeader.slice(7).trim().length<=20){
      throw new HttpException("Header missing ..",HttpStatus.BAD_REQUEST)
    }
    return this.conversationService.findAllConversation(authHeader.slice(7).trim());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto) {
    return this.conversationService.update(+id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(+id);
  }
}
