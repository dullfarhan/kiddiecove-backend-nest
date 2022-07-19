import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { EndpointService } from './endpoint.service';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/Guard/permission.guard';
import { Request, Response } from 'express';

@Controller('endpoint')
export class EndpointController {
  constructor(private readonly endpointService: EndpointService) {}
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('/get/list')
  getList(@Req() req: Request, @Res() res: Response) {
    this.endpointService.getList(req, res);
  }
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/by/admin/:id')
  deleteByAdmin(@Req() req: Request, @Res() res: Response) {
    this.endpointService.deleteByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/create/by/admin')
  createByAdmin(@Req() req: Request, @Res() res: Response) {
    this.endpointService.createByAdmin(req, res);
  }

  //////////////////////////////////////////////////////////////////
  @Post()
  create(@Body() createEndpointDto: CreateEndpointDto) {
    return this.endpointService.create(createEndpointDto);
  }

  @Get()
  findAll() {
    return this.endpointService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.endpointService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEndpointDto: UpdateEndpointDto,
  ) {
    return this.endpointService.update(+id, updateEndpointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.endpointService.remove(+id);
  }
}
