import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PermissionGuard } from 'src/Guard/permission.guard';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
// import { Body, Delete, Get, Post, Put } from '@nestjs/common';

@ApiTags('City')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  private readonly logger = new Logger(CityController.name);

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all')
  getAllForAdmin(@Req() req: Request, @Res() res: Response) {
    this.logger.log('city');
    this.cityService.getAllForAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/list/:id')
  getList(@Req() req: Request, @Res() res: Response) {
    this.cityService.getList(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/:id')
  getForAdmin(@Req() req: Request, @Res() res: Response) {
    this.cityService.getForAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/:id')
  updateByAdmin(@Req() req: Request, @Res() res: Response) {
    this.cityService.updateByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/directly/:id')
  updateDirectlyByAdmin(@Req() req: Request, @Res() res: Response) {
    this.cityService.updateDirectlyByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:id')
  deleteByAdmin(@Req() req: Request, @Res() res: Response) {
    this.cityService.deleteByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  createByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createCityDto: CreateCityDto,
  ) {
    this.cityService.createByAdmin(req, res);
  }

  // @Post()
  // create(@Body() createCityDto: CreateCityDto) {
  //   return this.cityService.create(createCityDto);
  // }

  // @Get
  // findAll() {
  //   return this.cityService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cityService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
  //   return this.cityService.update(+id, updateCityDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  // //   return this.cityService.remove(+id);
  // }
}
