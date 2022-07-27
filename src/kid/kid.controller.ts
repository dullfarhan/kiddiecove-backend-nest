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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { PermissionGuard } from 'src/Guard/permission.guard';
import Util from 'src/utils/util';
import { UpdateKidDto } from './dto/update-kid.dto';
import { KidService } from './kid.service';

@ApiTags('Kid')
@Controller('kid')
export class KidController {
  constructor(private readonly kidService: KidService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/admin')
  getAllKidsForAdmin(@Res() res: Response) {
    return this.kidService.getAllKidsForAdmin(res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/school/admin')
  getAllKidsForSchoolAdmin(@Req() req: Request, @Res() res: Response) {
    return this.kidService.getAllKidsForSchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/parent')
  getAllKidsForParent(@Req() req: Request, @Res() res: Response) {
    return this.kidService.getAllKidsForParent(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/as/listing/for/parent')
  getAllKidsAsListingForParent(@Req() req: Request, @Res() res: Response) {
    return this.kidService.getAllKidsAsListingForParent(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/as/listing/for/parent/for/registration')
  getAllKidsAsListingForParentForRegistration(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.kidService.getAllKidsAsListingForParentForRegistration(
      req,
      res,
    );
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/registration/get/all/as/listing/for/parent')
  getAllKidsForRegistrationAsListingForParent(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.kidService.getAllKidsForRegistrationAsListingForParent(
      req,
      res,
    );
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/for/admin/:id')
  getKidForAdmin(@Param('id') id: string, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('Invalid id', res);
    else return this.kidService.getKidForAdmin(id, res);
  }

  //doubt: fetching first kid under current school admin
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/for/school/admin/:id')
  getKidForSchoolAdmin(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('Invalid id', res);
    else return this.kidService.getKidForSchoolAdmin(req, res);
  }

  //doubt: fetching first kid under current parent
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/for/parent/:id')
  getKidForParent(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('Invalid id', res);
    else return this.kidService.getKidForParent(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/by/parent/:id')
  updateByParent(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateKidDto: UpdateKidDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('Invalid id', res);
    else return this.kidService.updateByParent(id, updateKidDto, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/create/by/parent')
  createKidByParent(
    @Body() createUserBody: UpdateKidDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.kidService.createKidByParent(createUserBody, req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/admin/:id')
  deleteByAdmin(@Param('id') id: string, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('Invalid id', res);
    else return this.kidService.deleteByAdmin(id, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/school/admin/:id')
  deleteBySchoolAdmin(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('Invalid id', res);
    else return this.kidService.deleteBySchoolAdmin(id, req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/parent/:id')
  deleteByParent(@Param('id') id: string, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return Util.getBadRequest('Invalid id', res);
    else return this.kidService.deleteByParent(id, res);
  }
}
