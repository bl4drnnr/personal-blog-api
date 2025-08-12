import { Body, Controller, Get, Put, UseGuards, UsePipes } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { BasicAuthGuard } from '@guards/basic-auth.guard';
import { UpdateMaintenanceModeDto } from '@dto/maintenance/requests/update-maintenance-mode.dto';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  // Public endpoint to check maintenance status
  @Get('maintenance-status')
  async getMaintenanceStatus() {
    return await this.maintenanceService.getMaintenanceStatus();
  }

  // Admin endpoint to get maintenance settings
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/maintenance')
  async getMaintenanceModeAdmin() {
    return await this.maintenanceService.getMaintenanceModeAdmin();
  }

  // Admin endpoint to update maintenance settings
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/maintenance')
  async updateMaintenanceMode(
    @Body() data: UpdateMaintenanceModeDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.maintenanceService.updateMaintenanceMode({ data, trx });
  }
}
