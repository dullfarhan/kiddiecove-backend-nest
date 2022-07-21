import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { SchoolAdminService } from './school-admin.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/Guard/permission.guard';

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
}
