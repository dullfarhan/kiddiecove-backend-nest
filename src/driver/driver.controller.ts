import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import { PermissionGuard } from 'src/Guard/permission.guard';
import { DriverService } from './driver.service';
import Util from 'src/utils/util';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/admin')
  getAllDriversForAdmin(@Req() req: Request, @Res() res: Response) {
    return this.driverService.getAllDriversForAdmin(req, res);
  }

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

  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/school/admin')
  getAllDriversForSchoolAdmin(@Req() req: Request, @Res() res: Response) {
    return this.driverService.getAllDriversForSchoolAdmin(req, res);
  }

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
}
