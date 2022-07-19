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
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
// import { Body, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('city')
export class CityController {
  ///////////////////////////////////////////////
  constructor(private readonly cityService: CityService) {}
  private readonly logger = new Logger('city');
  @Get('/get/all')
  getAllForAdmin(@Req() req: Request, @Res() res: Response) {
    this.logger.log('city');
    this.cityService.getAllForAdmin(req, res);
  }
  @Get('/get/list/:id')
  getList(@Req() req: Request, @Res() res: Response) {
    this.cityService.getList(req, res);
  }
  @Get('/get/:id')
  getForAdmin(@Req() req: Request, @Res() res: Response) {
    this.cityService.getForAdmin(req, res);
  }
  @Put('/update/:id')
  updateByAdmin(@Req() req: Request, @Res() res: Response) {
    this.cityService.updateByAdmin(req, res);
  }
  @Put('/update/directly/:id')
  updateDirectlyByAdmin(@Req() req: Request, @Res() res: Response) {
    this.cityService.updateDirectlyByAdmin(req, res);
  }

  @Delete('/delete/:id')
  deleteByAdmin(@Req() req: Request, @Res() res: Response) {
    this.cityService.deleteByAdmin(req, res);
  }

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
