import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatAuthService } from './chatAuth.service';
import { CreateChatAuthDto } from './dto/create-chatauth.dto';
import { UpdateChatAuthDto } from './dto/update-chatauth.dto';

@Controller('auth')
export class ChatAuthController {
  constructor(private readonly authService: ChatAuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateChatAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateChatAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
