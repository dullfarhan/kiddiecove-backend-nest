import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ParentService } from './parent.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { RequestParentDto } from './dto/request-parent.dto';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/Guard/permission.guard';
import { AuthGuard } from '@nestjs/passport';
import { REGISTRATION_STATUS } from 'src/utils/enums/Registration_status';

@ApiTags('Parent')
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @ApiQuery({ name: 'registration_status', enum: REGISTRATION_STATUS })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/admin')
  getAllParentsForAdmin(@Req() req: Request, @Res() res: Response) {
    this.parentService.getAllParentsForAdmin(req, res);
  }

  @ApiQuery({ name: 'registration_status', enum: REGISTRATION_STATUS })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/school/admin')
  getAllParentsForSchoolAdmin(@Req() req: Request, @Res() res: Response) {
    this.parentService.getAllParentsForSchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/for/admin/:id')
  getParentForAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.parentService.getParentForAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/for/school/admin/:id')
  getParentForSchoolAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.parentService.getParentForSchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get')
  getSelfDetailsForParent(@Req() req: Request, @Res() res: Response) {
    return this.parentService.getSelfDetailsForParent(req, res);
  }

  @Post('/create/by/parent')
  createParentByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createParentDto: CreateParentDto,
  ) {
    this.parentService.createParentByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/request/to/join')
  requestToJoin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() requestParentDto: RequestParentDto,
  ) {
    this.parentService.requestToJoin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/by/parent')
  updateByParent(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createParentDto: CreateParentDto,
  ) {
    this.parentService.updateByParent(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/directly/by/parent')
  updateDirectlyByParent(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createParentDto: CreateParentDto,
  ) {
    this.parentService.updateDirectlyByParent(req, res);
  }

  @ApiQuery({ name: 'school_id' })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/admin/:id')
  deleteByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.parentService.deleteByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/school/admin/:id')
  deleteBySchoolAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.parentService.deleteBySchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/parent')
  deleteByParent(@Req() req: Request, @Res() res: Response) {
    this.parentService.deleteByParent(req, res);
  }
  // @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @UseGuards(AuthGuard('jwt'))
  // @Delete('/delete/by/parent/:id')
  // deleteByParent(@Req() req: Request, @Res() res: Response) {
  //   this.parentService.deleteByParent(req, res);
  // }
}
