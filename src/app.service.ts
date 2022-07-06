import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  print() {
    return 'HELLO WORLD';
  }
}
