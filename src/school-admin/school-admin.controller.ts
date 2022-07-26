import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SchoolAdminService } from './school-admin.service';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/Guard/permission.guard';
import mongoose from 'mongoose';
import Util from 'src/utils/util';
import { UpdateSchoolAdminDto } from './dto/update-school-admin.dto';

@ApiTags('School Admin')
@Controller('school-admin')
export class SchoolAdminController {
  constructor(private readonly schoolAdminService: SchoolAdminService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/admin')
  getAllForAdmin(@Res() res: Response) {
    this.schoolAdminService.getAllForAdmin(res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/for/admin/:id')
  getForAdmin(@Param('id') id: string, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else return this.schoolAdminService.getForAdmin(id, res);
  }

  @Get('/get/all/as/listing/for/registration')
  getAllAsListingForRegistration(@Res() res: Response) {
    return this.schoolAdminService.getAllAsListingForRegistration(res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/by/admin/:id')
  updateByAdmin(
    @Body() updateSchoolAdminDto: UpdateSchoolAdminDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else
      return this.schoolAdminService.updateByAdmin(
        id,
        updateSchoolAdminDto,
        res,
      );
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/directly/by/admin/:id')
  updateDirectlyByAdmin(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() updateSchoolAdminDto: UpdateSchoolAdminDto,
  ) {
    {
      if (!mongoose.Types.ObjectId.isValid(id))
        Util.getBadRequest('invalid user id', res);
      else
        return this.schoolAdminService.updateDirectlyByAdmin(
          id,
          updateSchoolAdminDto,
          res,
        );
    }
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/admin/:id')
  deleteByAdmin(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else return this.schoolAdminService.deleteByAdmin(id, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  createByAdmin(
    @Res() res: Response,
    @Body() updateSchoolAdminDto: UpdateSchoolAdminDto,
  ) {
    this.schoolAdminService.createByAdmin(updateSchoolAdminDto, res);
  }
}
