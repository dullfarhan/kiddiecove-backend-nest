import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import mongoose from 'mongoose';
import Util from 'src/utils/util';
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
    if (!mongoose.Types.ObjectId.isValid(getChatDto?.id)) {
      return Util.getBadRequest('Invalid id', res);
    } else {
      return this.chatService.getChat(getChatDto, res);
    }
  }

  @Post('/get/recent')
  getRecentChat(@Body() getChatDto: GetChatDto, @Res() res: Response) {
    return this.chatService.getRecentChat(getChatDto, res);
  }
}
