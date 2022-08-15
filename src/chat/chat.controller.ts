import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  createChat(@Body() createChatDto: CreateChatDto, @Res() res: Response) {
    return this.chatService.createChat(createChatDto, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/get')
  getChat(@Body() getChatDto: GetChatDto, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(getChatDto?.id)) {
      return Util.getBadRequest('Invalid id', res);
    } else {
      return this.chatService.getChat(getChatDto, res);
    }
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/get/recent')
  getRecentChat(@Body() getChatDto: GetChatDto, @Res() res: Response) {
    return this.chatService.getRecentChat(getChatDto, res);
  }
}
