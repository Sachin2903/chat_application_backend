import { PartialType } from '@nestjs/mapped-types';
import { CreateChatAuthDto } from './create-chatauth.dto';

export class UpdateChatAuthDto extends PartialType(CreateChatAuthDto) {}
