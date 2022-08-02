import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Res,
  Req,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/Guard/permission.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/list')
  getList(@Req() req: Request, @Res() res: Response) {
    return this.rolesService.getList(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/by/admin/:id')
  updateByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    this.rolesService.updateByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/:id')
  get(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
    this.rolesService.get(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/admin/:id')
  deleteByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.rolesService.deleteByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/create/by/admin')
  createByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    this.rolesService.createByAdmin(req, res);
  }
  ///////////////////////////////////////////////////////////////////
}
