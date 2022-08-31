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
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/admin')
  getAllForAdmin(@Req() req: Request, @Res() res: Response) {
    this.userService.getAllForAdmin(res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('getAll/for/admin')
  getAllForAdminListing(@Res() res: Response) {
    return this.userService.getAllForAdminListing(res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/getAll')
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
  getById(@Param('id') id: string, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else return this.userService.getUserForAdmin(id, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/chat/user/for/school/admin')
  getParentforschooladmin(@Req() req: Request, @Res() res: Response) {
    return this.userService.getUserForSchoolAdminListing(res, req);
  }
}
