import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import Util from 'src/utils/util';

@Injectable()
export class TrackingServiceService {
  url = 'http://www.dyegoo.net/Ajax/DevicesAjax.asmx/GetTracking';
  data = { DeviceID: 265495, TimeZone: 'China Standard Time' };

  config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'ASP.NET_SessionId=tj3nmaxs4oqt1phhqha5nikj',
    },

    withCredentials: true,
  };
  constructor(private readonly httpService: HttpService) {}

  async trackChild(res) {
    // console.log('yha aya ha')
    const response: any = await this.httpService.post(
      this.url,
      this.data,
      this.config,
    );

    var obj1 = JSON.stringify(response.data.d);

    // console.log('Data', obj1)

    let jsonOffset1 = response.data.d.split('latitude');

    let data1 = jsonOffset1[1].split('speed')[0];
    let data2 = data1.split(',longitude');

    console.log('Data', data2[0].split(':'));
    var lat = data2[0].split(':')[1].replace(/"/g, '');
    var long = data2[1].split(':')[1].split(',')[0].replace(/"/g, '');
    console.log('latiitude', lat);
    console.log('longtitude', long);
    const position = {
      latitude: parseFloat(lat),
      longitude: parseFloat(long),
    };
    console.log('Position', position);
    return Util.getOkRequest(position, 'Hello', res);
  }
}
