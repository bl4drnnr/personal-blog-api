import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { SiteConfigService } from './config.service';
import { UpdateSiteConfigDto } from './dto/config.dto';

@ApiTags('Config')
@Controller()
export class SiteConfigController {
  constructor(private readonly config: SiteConfigService) {}

  @Get('config')
  @ApiOperation({ summary: 'Public site configuration' })
  @ApiOkResponse({ description: 'Hero, intro, social links, SEO defaults, footer.' })
  get() {
    return this.config.get();
  }

  @Put('admin/config')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[admin] Update site configuration' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
  update(@Body() dto: UpdateSiteConfigDto) {
    return this.config.update(dto);
  }
}
