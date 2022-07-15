import {
  Controller,
  Get,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import { PermissionGuard } from 'src/Guard/permission.guard';
import { DriverService } from './driver.service';
import Util from 'src/utils/util';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Driver')
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/admin')
  getAllDriversForAdmin(@Req() req: Request, @Res() res: Response) {
    return this.driverService.getAllDriversForAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/for/admin/:id')
  getDriverForAdmin(
    @Param('id') id: mongoose.Types.ObjectId,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      Util.getBadRequest('invalid user id', res);
    } else return this.driverService.getDriverForAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/school/admin')
  getAllDriversForSchoolAdmin(@Req() req: Request, @Res() res: Response) {
    return this.driverService.getAllDriversForSchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/for/school/admin/:id')
  getDriverForSchoolAdmin(
    @Param('id') id: mongoose.Types.ObjectId,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      Util.getBadRequest('invalid user id', res);
    } else return this.driverService.getDriverForSchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/as/lisitng/for/admin/:id')
  getAllDriversAsListingForAdmin(
    @Param('id') id: mongoose.Types.ObjectId,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else return this.driverService.getAllDriversAsListingForAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/as/lisitng/for/school/admin')
  getAllDriversAsListingForSchoolAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.driverService.getAllDriversAsListingForSchoolAdmin(req, res);
  }

  @Put('/update/by/admin/:id')
  updateDriverByAdmin(
    @Param('id') id: mongoose.Types.ObjectId,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid) {
      Util.getBadRequest('invalid user id', res);
    } else this.driverService.updateDriverByAdmin(req, res);
  }
}