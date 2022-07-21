import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeService {
  get() {
    return {
      title: 'Kiddie Cove',
      message: 'Kiddie Cove Development Server Backend',
    };
  }
}
