import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('School')
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}
  @Get('/')
  getAllForAdmin(@Req() req: Request, @Res() res: Response) {
    this.schoolService.getAllForAdmin(req, res);
  }
  @Get('/listing')
  getAllAsListing(@Req() req: Request, @Res() res: Response) {
    this.schoolService.getAllAsListing(req, res);
  }
  @Get('/get/qr-code/for/admin/:id')
  getQrCodeForAdmin(@Req() req: Request, @Res() res: Response) {
    // [authorization, filterChain, validateObjectId],
    this.schoolService.getQrCodeForAdmin(req, res);
  }
  @Get('/get/qr-code/for/school/admin')
  getQrCodeForSchoolAdmin() {
    // this.schoolService.getQrCodeForSchoolAdmin(req, res);
  }
  @Get('/get/for/admin/:id')
  getForAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createSchoolDto: CreateSchoolDto,
  ) {
    this.schoolService.getForAdmin(req, res);
  }
  @Put('/update/by/admin/:id')
  updateByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createSchoolDto: CreateSchoolDto,
  ) {
    this.schoolService.updateByAdmin(req, res);
  }
  @Put('/update/directly/by/admin/:id')
  updateDirectlyByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createSchoolDto: CreateSchoolDto,
  ) {
    this.schoolService.updateDirectlyByAdmin(req, res);
  }

  @Delete('/delete/by/admin/:id')
  deleteByAdmin(@Req() req: Request, @Res() res: Response) {
    this.schoolService.deleteByAdmin(req, res);
  }

  @Post('/')
  createByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createSchoolDto: CreateSchoolDto,
  ) {
    this.schoolService.createByAdmin(req, res);
  }
  //This id is parentId
  @Post('/approve/request/:id')
  approveRequest(@Req() req: Request, @Res() res: Response) {
    // this.schoolService.approveRequest(req, res);
  }

  //This id is parentId
  @Post('/approve/request/by/school/admin/:id')
  approveRequestBySchoolAdmin(@Req() req: Request, @Res() res: Response) {
    // this.schoolService.approveRequestBySchoolAdmin(req, res);
  }
}
