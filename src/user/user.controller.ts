import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import Util from 'src/utils/util';
import { PermissionGuard } from '../Guard/permission.guard';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //to be completed
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/get/all/for/admin')
  getAllForAdmin(@Req() req: Request, @Res() res: Response) {
    this.userService.getAllForAdmin(req, res);
  }

  @Post('getAll/for/admin')
  getAllForAdminListing(@Res() res: Response) {
    return this.userService.getAllForAdminListing(res);
  }

  @Post('/getAll')
  getAllForParentListing(@Res() res: Response) {
    return this.userService.getAllForParentListing(res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  getCurrentUser(@Req() req: Request, @Res() res: Response) {
    return this.userService.getCurrentUser(req, res);
  }
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/:id')
  getById(@Param('id') id: mongoose.Types.ObjectId, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else return this.userService.getUserForAdmin(id, res);
  }
}
