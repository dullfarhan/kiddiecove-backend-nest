import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('/get/list')
  getList(@Req() req: Request, @Res() res: Response) {
    this.permissionService.getList(req, res);
  }

  @Delete('/delete/by/admin/:id')
  deleteByAdmin(@Req() req: Request, @Res() res: Response) {
    this.permissionService.deleteByAdmin(req, res);
  }

  @Post('/create/by/admin')
  createByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    this.permissionService.createByAdmin(req, res);
  }
  ////////////////////////////////////////////////////////////////
}
