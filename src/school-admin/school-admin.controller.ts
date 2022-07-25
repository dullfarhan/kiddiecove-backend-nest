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
import { SchoolAdminService } from './school-admin.service';
import { CreateSchoolAdminDto } from './dto/create-school-admin.dto';
import { UpdateSchoolAdminDto } from './dto/update-school-admin.dto';
import { Request, Response } from 'express';

@Controller('schoolAdmin')
export class SchoolAdminController {
  constructor(private readonly schoolAdminService: SchoolAdminService) {}

  @Get('/get/all/for/admin')
  getAllForAdmin(@Res() res: Response, @Req() req: Request) {
    this.schoolAdminService.getAllForAdmin(req, res);
  }
  @Get('/get/for/admin/:id')
  getForAdmin(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    this.schoolAdminService.getForAdmin(req, res);
  }
  @Get('/get/all/as/listing/for/registration')
  getAllAsListingForRegistration(@Res() res: Response, @Req() req: Request) {
    // [authorization, filterChain],
    this.schoolAdminService.getAllAsListingForRegistration(req, res);
  }
  @Put('/update/by/admin/:id')
  updateByAdmin(
    @Res() res: Response,
    @Req() req: Request,
    @Body() createSchoolAdminDto: CreateSchoolAdminDto,
  ) {
    this.schoolAdminService.updateByAdmin(req, res);
  }
  @Put('/update/directly/by/admin/:id')
  updateDirectlyByAdmin(
    @Res() res: Response,
    @Req() req: Request,
    @Body() createSchoolAdminDto: CreateSchoolAdminDto,
  ) {
    this.schoolAdminService.updateDirectlyByAdmin(req, res);
  }

  @Delete('/delete/by/admin/:id')
  deleteByAdmin(@Res() res: Request, @Req() req: Request) {
    this.schoolAdminService.deleteByAdmin(req, res);
  }

  @Post('/')
  createByAdmin(
    @Res() res: Response,
    @Req() req: Request,
    @Body() createSchoolAdminDto: CreateSchoolAdminDto,
  ) {
    console.log('in');

    return this.schoolAdminService.createByAdmin(req, res);
  }

  ////////////////////////////////////////////////////////////////////////////////R
  // @Post()
  // create(@Body() createSchoolAdminDto: CreateSchoolAdminDto) {
  //   return this.schoolAdminService.create(createSchoolAdminDto);
  // }

  // @Get()
  // findAll() {
  //   return this.schoolAdminService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.schoolAdminService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSchoolAdminDto: UpdateSchoolAdminDto,
  // ) {
  //   return this.schoolAdminService.update(+id, updateSchoolAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.schoolAdminService.remove(+id);
  // }
}
