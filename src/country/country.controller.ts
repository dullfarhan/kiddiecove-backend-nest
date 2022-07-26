import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { PermissionGuard } from 'src/Guard/permission.guard';
import Util from 'src/utils/util';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';

@ApiTags('Country')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/all')
  getAllForAdmin(@Res() res: Response) {
    this.countryService.getAllForAdmin(res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/list')
  getList(@Res() res: Response) {
    this.countryService.getList(res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/:id')
  getForAdmin(@Param('id') id: string, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else return this.countryService.getForAdmin(id, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/:id')
  updateByAdmin(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() createCountryDto: CreateCountryDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else return this.countryService.updateByAdmin(id, createCountryDto, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put('/update/directly/:id')
  updateDirectlyByAdmin(
    @Param() id: string,
    @Res() res: Response,
    @Body() createCountryDto: CreateCountryDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else
      return this.countryService.updateDirectlyByAdmin(
        id,
        createCountryDto,
        res,
      );
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  createByAdmin(
    @Body() createCountryDto: CreateCountryDto,
    @Res() res: Response,
  ) {
    console.log(createCountryDto);
    this.countryService.createByAdmin(createCountryDto, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:id')
  deleteByAdmin(@Param('id') id: string, @Res() res: Response) {
    if (!mongoose.Types.ObjectId.isValid(id))
      Util.getBadRequest('invalid user id', res);
    else return this.countryService.deleteByAdmin(id, res);
  }
}
