import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AboutService } from './about.service';

@ApiTags('About')
@Controller('about')
export class AboutController {
  constructor(private readonly about: AboutService) {}

  @Get()
  @ApiOperation({ summary: 'Public CV: profile, positions, education, certifications' })
  @ApiOkResponse({ description: 'Aggregated CV data with asset ids resolved to URLs.' })
  get() {
    return this.about.getPublic();
  }
}
