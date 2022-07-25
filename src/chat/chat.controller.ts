import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/create')
  createChat(@Body() createChatDto: CreateChatDto, @Res() res: Response) {
    return this.chatService.createChat(createChatDto, res);
  }

  @Post('/get')
  getChat(@Body() getChatDto: GetChatDto, @Res() res: Response) {
    return this.chatService.getChat(getChatDto, res);
  }

  @Post('/get/recent')
  getRecentChat(@Body() getChatDto: GetChatDto, @Res() res: Response) {
    return this.chatService.getRecentChat(getChatDto, res);
  }
}
