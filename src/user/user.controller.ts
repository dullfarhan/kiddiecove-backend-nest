import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //to be completed
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/get/all/for/admin')
  getAllForAdmin(@Req() req: Request, @Res() res: Response) {
    this.userService.getAllForAdmin(req, res);
  }

  @Post('getAll/for/admin')
  getAllForAdminListing(@Req() req: Request, @Res() res: Response) {
    return this.userService.getAllForAdminListing(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  getCurrentUser(@Req() req: Request, @Res() res: Response) {
    console.log({ Request: req.user });
    this.userService.getCurrentUser(req, res);
  }
}
