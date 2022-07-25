import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { ChatDocument } from 'src/Schemas';
import Util from 'src/utils/util';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  private readonly logger: Logger = new Logger('Chat Service');

  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  async createChat(createChatDto: CreateChatDto, res: Response) {
    this.logger.log('Creating Chat');
    try {
      this.logger.log('Creating Chat Process');
      const savedChat = await this.chatModel.findOne({
        toUser: createChatDto.toUser,
        fromUser: createChatDto.fromUser,
      });

      if (savedChat) {
        return Util.getBadRequest('chat already created', res);
      }

      const chat = new this.chatModel({
        toUser: createChatDto.toUser,
        fromUser: createChatDto.fromUser,
      });

      const result = await chat.save();
      this.logger.log('Chat Saved');
      return Util.getOkRequest(result, 'chat created', res);
    } catch (error) {
      this.logger.log('Exception Occured ', error);
      return Util.getBadRequest(error, res);
    }
  }

  async getChat(getChatDto: GetChatDto, res: Response) {
    this.logger.log('Getting Process');

    const registeredUser = await this.chatModel
      .find()
      .or([{ toUser: getChatDto.id }, { fromUser: getChatDto.id }])
      .populate('toUser', { name: 1, type: 1, avatar: 1 })
      .populate('fromUser', { name: 1, type: 1, avatar: 1 });

    if (!registeredUser) {
      return Util.getBadRequest('User  is invalid', res);
    }

    this.logger.log('Getting OK');
    return Util.getOkRequest(registeredUser, 'Chat Found...', res);
  }

  async getRecentChat(getChatDto: GetChatDto, res) {
    this.logger.log('Getting Process');
    const registeredUser = await this.chatModel
      .findOne()
      .or([{ toUser: getChatDto.id }, { fromUser: getChatDto.id }])
      .populate('toUser', { name: 1, type: 1, avatar: 1 })
      .populate('fromUser', { name: 1, type: 1, avatar: 1 });

    if (!registeredUser) {
      return Util.getBadRequest('User  is invalid', res);
    }
    this.logger.log('Getting OK');
    return Util.getOkRequest(registeredUser, 'Chat Found successfully', res);
  }
}
