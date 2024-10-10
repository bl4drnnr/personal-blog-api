import { Controller, Get } from '@nestjs/common';
import { ControlService } from '@modules/control/control.service';

@Controller('control')
export class ControlController {
  constructor(private readonly controlService: ControlService) {}

  @Get('health-check')
  getHealthCheck() {
    return this.controlService.getHealthCheck();
  }
}
