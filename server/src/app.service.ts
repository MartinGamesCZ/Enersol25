import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  charging: boolean = true;
  charge: number = 0;

  setCharging(charging: boolean) {
    this.charging = charging;
  }

  getData() {
    return JSON.stringify({
      charging: this.charging,
      charge: this.charge,
    });
  }

  setData(d: any) {
    this.charge = d.charge;
  }
}
