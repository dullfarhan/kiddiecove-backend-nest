import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Put,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { PermissionGuard } from 'src/Guard/permission.guard';
import Util from 'src/utils/util';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all')
  getAllAdmins(@Res() res: Response) {
    return this.adminService.getAllAdmins(res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/:id')
  getAdmin(@Param('id') id: string, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else {
      return this.adminService.getAdmin(id, res);
    }
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.adminService.createAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/:id')
  updateAdmin(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
    @Body() createAdminDto: CreateAdminDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else return this.adminService.updateAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('update/directly/:id')
  updateAdminDirectly(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else return this.adminService.updateAdminDirectly(id, req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:id')
  deleteAdmin(@Param('id') id: string, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      Util.getBadRequest('invalid user id', res);
    } else {
      return this.adminService.deleteAdmin(id, res);
    }
  }
}
