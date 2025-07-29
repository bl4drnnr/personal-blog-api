import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  // Public endpoint for frontend SSR
  @Get('home')
  async getHomePageData() {
    return await this.homeService.getHomePageData();
  }
}
