import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as pdf from 'html-pdf';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/Guard/permission.guard';
import mongoose from 'mongoose';
import Util from 'src/utils/util';
import { createWriteStream, writeFileSync } from 'fs';
import { Stream } from 'stream';

@ApiTags('School')
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  getAllForAdmin(@Req() req: Request, @Res() res: Response) {
    this.schoolService.getAllForAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/listing')
  getAllAsListing(@Req() req: Request, @Res() res: Response) {
    this.schoolService.getAllAsListing(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/qr-code/for/admin/:id')
  async getQrCodeForAdmin(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('Invalid Id', res);
    else await this.schoolService.getQrCodeForAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/qr-code/for/school/admin')
  getQrCodeForSchoolAdmin(@Req() req: Request, @Res() res: Response) {
    // this.schoolService.getQrCodeForSchoolAdmin(req, res);
    //issue: pdf is being streamed to response whereas this route required it to be a file
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/for/admin/:id')
  getForAdmin(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid)
      return Util.getBadRequest('Invalid id', res);
    else return this.schoolService.getForAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  createByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createSchoolDto: CreateSchoolDto,
  ) {
    this.schoolService.createByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  //This id is parentId
  @Post('/approve/request/:id')
  approveRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    if (!mongoose.Types.ObjectId.isValid)
      return Util.getBadRequest('Invalid Id', res);
    else this.schoolService.approveRequest(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  //This id is parentId
  @Post('/approve/request/by/school/admin/:id')
  approveRequestBySchoolAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    if (!mongoose.Types.ObjectId.isValid)
      return Util.getBadRequest('Invalid Id', res);
    else this.schoolService.approveRequestBySchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/by/admin/:id')
  updateByAdmin(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() createSchoolDto: CreateSchoolDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid)
      return Util.getBadRequest('Invalid Id', res);
    else return this.schoolService.updateByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/directly/by/admin/:id')
  updateDirectlyByAdmin(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() createSchoolDto: CreateSchoolDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid)
      return Util.getBadRequest('Invalid Id', res);
    else return this.schoolService.updateDirectlyByAdmin(req, res);
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
    if (!mongoose.Types.ObjectId.isValid)
      return Util.getBadRequest('Invalid Id', res);
    else return this.schoolService.deleteByAdmin(req, res);
  }
}
