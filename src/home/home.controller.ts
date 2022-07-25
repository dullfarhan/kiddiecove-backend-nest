import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HomeService } from './home.service';

@ApiTags('Home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post()
  get() {
    return this.homeService.get();
  }
}
