import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/data')
  getData() {
    return this.appService.getData();
  }

  @Get('/set/charging')
  setCharging(@Query('charging') charging: string) {
    this.appService.setCharging(charging == '1' ? true : false);

    return 'Charging set to true';
  }

  @Get('/set')
  setData(@Query() query: any) {
    this.appService.setData(query);

    return 'Data set';
  }
}
