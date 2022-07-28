import {
  Controller,
  Get,
  Post,
  Delete,
  Req,
  Res,
  Logger,
  UseGuards,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/Guard/permission.guard';

@ApiTags('Teacher')
@Controller('teacher')
export class TeacherController {
  private readonly logger = new Logger('teacher');
  constructor(private readonly teacherService: TeacherService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('get/all/for/admin')
  getAllTeachersForAdmin(@Req() req: Request, @Res() res: Response) {
    this.logger.log('getting Teacher listing for admin');
    return this.teacherService.getAllTeachers(
      req,
      res,
      {
        enable: true,
      },
      {},
    );
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('get/all/for/admin/:id')
  getTeacherForAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.logger.log('getting Teacher detail for admin' + req.params.id);
    return this.teacherService.getAllTeachers(
      req,
      res,
      { _id: req.params.id, enable: true },
      {},
    );
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/school/admin')
  getAllTeachersForSchoolAdmin(@Req() req: Request, @Res() res: Response) {
    this.teacherService.getAllTeachersForSchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/as/lisitng/for/admin/:id')
  getAllTeachersAsListingForAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.logger.log('getting Teacher listing for admin');
    this.teacherService.getAllTeachers(
      req,
      res,
      {
        enable: true,
        school_id: req.params.id,
      },
      { _id: 1, name: 1 },
    );
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/for/school/admin/:id')
  getTeacherForSchoolAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.teacherService.getTeacherForSchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/as/lisitng/for/school/admin')
  getAllTeachersAsListingForSchoolAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.teacherService.getAllTeachersAsListingForSchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/by/admin/:id')
  updateTeacherByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createTeacherDto: CreateTeacherDto,
    @Param('id') id: string,
  ) {
    this.teacherService.updateTeacherByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/directly/by/admin/:id')
  updateTeacherByAdminDirectly(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createTeacherDto: CreateTeacherDto,
    @Param('id') id: string,
  ) {
    this.teacherService.updateTeacherByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/by/school/admin/:id')
  updateTeacherBySchoolAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createTeacherDto: CreateTeacherDto,
    @Param('id') id: string,
  ) {
    this.teacherService.updateTeacherBySchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/directly/by/school/admin/:id')
  updateTeacherBySchoolAdmindirectly(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createTeacherDto: CreateTeacherDto,
    @Param('id') id: string,
  ) {
    this.teacherService.updateTeacherBySchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/admin/:id')
  deleteTeacherByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.teacherService.deleteTeacherByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/school/admin/:id')
  deleteTeacherBySchoolAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.teacherService.deleteTeacherBySchoolAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  createTeacherByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createTeacherDto: CreateTeacherDto,
  ) {
    this.teacherService.createTeacherByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/create/by/school/admin')
  createTeacherBySchoolAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createTeacherDto: CreateTeacherDto,
  ) {
    this.teacherService.createTeacherBySchoolAdmin(req, res);
  }
}
