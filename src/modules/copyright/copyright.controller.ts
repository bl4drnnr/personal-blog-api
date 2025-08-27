import { Body, Controller, Get, Put, UseGuards, UsePipes } from '@nestjs/common';
import { CopyrightService } from './copyright.service';
import { AuthGuard } from '@guards/auth.guard';
import { BasicAuthGuard } from '@guards/basic-auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { UpdateCopyrightDataDto } from '@dto/update-copyright-data.dto';

@Controller('copyright')
export class CopyrightController {
  constructor(private readonly copyrightService: CopyrightService) {}

  @Get('get-copyright-data')
  async getCopyrightData() {
    return await this.copyrightService.getCopyrightData();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/get-copyright-data')
  async getCopyrightDataAdmin() {
    return this.copyrightService.getCopyrightDataAdmin();
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/update-copyright-data')
  async updateCopyrightData(@Body() data: UpdateCopyrightDataDto) {
    return await this.copyrightService.updateCopyrightData(data);
  }
}
