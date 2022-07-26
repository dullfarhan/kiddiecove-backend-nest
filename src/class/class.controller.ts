import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  Param,
  Put,
  Delete,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { PermissionGuard } from 'src/Guard/permission.guard';
import Util from 'src/utils/util';
import { ClassService } from './class.service';
import { UpdateClassDto } from './dto/update-class.dto';

@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/admin')
  getAllClassesForAdmin(@Res() res: Response) {
    return this.classService.getAllClassesForAdmin(res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/school/admin')
  getAllClassesForSchoolAdmin(@Req() req: Request, @Res() res: Response) {
    this.classService.getAllClassesForSchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/as/listing/for/parent/:id')
  getAllClassesAsListingForParent(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('invalid user id', res);
    else return this.classService.getAllClassesAsListingForParent(id, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/for/admin/:id')
  getClassForAdmin(@Param('id') id: string, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('invalid user id', res);
    else return this.classService.getClassForAdmin(id, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/for/school/admin/:id')
  getClassForSchoolAdmin(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('invalid user id', res);
    else return this.classService.getClassForSchoolAdmin(id, req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/by/admin/:id')
  updateClassByAdmin(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('invalid user id', res);
    else return this.classService.updateClassByAdmin(id, updateClassDto, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/by/school/admin/:id')
  updateClassBySchoolAdmin(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    updateClassDto: UpdateClassDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('invalid user id', res);
    else
      return this.classService.updateClassBySchoolAdmin(
        id,
        req,
        updateClassDto,
        res,
      );
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/directly/by/admin/:id')
  updateClassByAdminDirectly(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('invalid user id', res);
    else
      return this.classService.updateClassByAdmin(
        id,
        updateClassDto,
        res,
        true,
      );
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/directly/by/school/admin/:id')
  updateClassBySchoolAdminDirectly(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('invalid user id', res);
    else
      return this.classService.updateClassBySchoolAdmin(
        id,
        req,
        updateClassDto,
        res,
        true,
      );
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  createClassByAdmin(
    @Body() updateClassDto: UpdateClassDto,
    @Res() res: Response,
  ) {
    this.classService.createClassByAdmin(updateClassDto, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/create/by/school/admin')
  createClassBySchoolAdmin(
    @Body() updateClassDto: UpdateClassDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.classService.createClassBySchoolAdmin(req, updateClassDto, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/admin/:id')
  deleteClassByAdmin(@Param() id: string, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('invalid user id', res);
    else this.classService.deleteClassByAdmin(id, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/school/admin/:id')
  deleteClassBySchoolAdmin(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('invalid user id', res);
    else return this.classService.deleteClassBySchoolAdmin(id, req, res);
  }
}
