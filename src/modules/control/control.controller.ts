import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ControlService } from '@modules/control/control.service';
import { AuthGuard } from '@guards/auth.guard';

@Controller('control')
export class ControlController {
  constructor(private readonly controlService: ControlService) {}

  @Get('health-check')
  getHealthCheck() {
    return this.controlService.getHealthCheck();
  }

  @Post('trigger-deployment')
  @UseGuards(AuthGuard)
  async triggerDeployment() {
    return this.controlService.triggerDeployment();
  }
}
