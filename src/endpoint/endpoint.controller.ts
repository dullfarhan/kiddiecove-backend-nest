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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/Guard/permission.guard';
import { Request, Response } from 'express';

@ApiTags('EndPoint')
@Controller('endpoints')
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
  deleteByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.endpointService.deleteByAdmin(req, res);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/create/by/admin')
  createByAdmin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createEndpointDto: CreateEndpointDto,
  ) {
    this.endpointService.createByAdmin(req, res);
  }

  //////////////////////////////////////////////////////////////////
}
