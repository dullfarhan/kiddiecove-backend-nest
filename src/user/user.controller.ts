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
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { PermissionGuard } from './Guard/permission.guard';
import { UserService } from './user.service';

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
  getAllForAdminListing(@Req() req: Request, @Res() res: Response) {
    return this.userService.getAllForAdminListing(req, res);
  }

  @Post('/getAll')
  getAllForParentListing(@Req() req: Request, @Res() res: Response) {
    return this.userService.getAllForParentListing(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  getCurrentUser(@Req() req: Request, @Res() res: Response) {
    this.userService.getCurrentUser(req, res);
  }
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/:id')
  getById(@Param('id') id: ObjectId) {}
}
