import {
  Controller,
  Post,
} from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post()
  get() {
    return this.homeService.get();
  }
}
