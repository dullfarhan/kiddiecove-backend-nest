import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { StatService } from './stat.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Stats')
@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get('/get/all/for/admin')
  getStatsForAdmin(@Res() res: Response) {
    return this.statService.getStatsForAdmin(res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all/for/school/admin')
  getStatsForSchoolAdmin(@Res() res: Response, @Req() req: Request) {
    this.statService.getStatsForSchoolAdmin(req, res);
  }
}
