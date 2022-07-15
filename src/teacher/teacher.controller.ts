import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { FilterQuery, Model } from 'mongoose';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Teacher')
@Controller('teacher')
export class TeacherController {
  private readonly logger = new Logger('teacher');
  constructor(private readonly teacherService: TeacherService) {}

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

  @UseGuards(AuthGuard('jwt'))
  @Get('get/all/for/admin/:id')
  getTeacherForAdmin(@Req() req: Request, @Res() res: Response) {
    this.logger.log('getting Teacher detail for admin' + req.params.id);
    return this.teacherService.getAllTeachers(
      req,
      res,
      { _id: req.params.id, enable: true },
      {},
    );
  }

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(+id, updateTeacherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.remove(+id);
  }
}
function FilterQuer() {
  throw new Error('Function not implemented.');
}
