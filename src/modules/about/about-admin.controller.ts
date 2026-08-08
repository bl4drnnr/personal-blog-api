import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { certifications, education, positions } from '@db/schema';
import { AboutService } from './about.service';
import { CertificationDto, EducationDto, PositionDto, UpdateAboutDto } from './dto/about.dto';

@ApiTags('About')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@Controller('admin')
@UseGuards(AccessTokenGuard)
export class AboutAdminController {
  constructor(private readonly about: AboutService) {}

  @Get('about')
  @ApiOperation({ summary: '[admin] Get CV data with raw asset ids' })
  get() {
    return this.about.getAdmin();
  }

  @Put('about')
  @ApiOperation({ summary: '[admin] Update the profile block' })
  update(@Body() dto: UpdateAboutDto) {
    return this.about.updateAbout(dto);
  }

  // --- positions ------------------------------------------------------------

  @Post('positions')
  @ApiOperation({ summary: '[admin] Add a work-history entry' })
  createPosition(@Body() dto: PositionDto) {
    return this.about.createEntry(positions, dto);
  }

  @Put('positions/:id')
  @ApiOperation({ summary: '[admin] Update a work-history entry' })
  updatePosition(@Param('id', ParseUUIDPipe) id: string, @Body() dto: PositionDto) {
    return this.about.updateEntry(positions, id, dto);
  }

  @Delete('positions/:id')
  @HttpCode(204)
  @ApiOperation({ summary: '[admin] Delete a work-history entry' })
  async removePosition(@Param('id', ParseUUIDPipe) id: string) {
    await this.about.removeEntry(positions, id);
  }

  // --- education ------------------------------------------------------------

  @Post('education')
  @ApiOperation({ summary: '[admin] Add an education entry' })
  createEducation(@Body() dto: EducationDto) {
    return this.about.createEntry(education, dto);
  }

  @Put('education/:id')
  @ApiOperation({ summary: '[admin] Update an education entry' })
  updateEducation(@Param('id', ParseUUIDPipe) id: string, @Body() dto: EducationDto) {
    return this.about.updateEntry(education, id, dto);
  }

  @Delete('education/:id')
  @HttpCode(204)
  @ApiOperation({ summary: '[admin] Delete an education entry' })
  async removeEducation(@Param('id', ParseUUIDPipe) id: string) {
    await this.about.removeEntry(education, id);
  }

  // --- certifications -------------------------------------------------------

  @Post('certifications')
  @ApiOperation({ summary: '[admin] Add a certification' })
  createCertification(@Body() dto: CertificationDto) {
    return this.about.createEntry(certifications, dto);
  }

  @Put('certifications/:id')
  @ApiOperation({ summary: '[admin] Update a certification' })
  updateCertification(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CertificationDto) {
    return this.about.updateEntry(certifications, id, dto);
  }

  @Delete('certifications/:id')
  @HttpCode(204)
  @ApiOperation({ summary: '[admin] Delete a certification' })
  async removeCertification(@Param('id', ParseUUIDPipe) id: string) {
    await this.about.removeEntry(certifications, id);
  }
}
