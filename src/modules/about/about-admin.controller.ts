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
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { certifications, education, positions } from '../../db/schema';
import { AboutService } from './about.service';
import { CertificationDto, EducationDto, PositionDto, UpdateAboutDto } from './dto/about.dto';

@Controller('admin')
@UseGuards(AccessTokenGuard)
export class AboutAdminController {
  constructor(private readonly about: AboutService) {}

  @Get('about')
  get() {
    return this.about.getAdmin();
  }

  @Put('about')
  update(@Body() dto: UpdateAboutDto) {
    return this.about.updateAbout(dto);
  }

  // --- positions ------------------------------------------------------------

  @Post('positions')
  createPosition(@Body() dto: PositionDto) {
    return this.about.createEntry(positions, dto);
  }

  @Put('positions/:id')
  updatePosition(@Param('id', ParseUUIDPipe) id: string, @Body() dto: PositionDto) {
    return this.about.updateEntry(positions, id, dto);
  }

  @Delete('positions/:id')
  @HttpCode(204)
  async removePosition(@Param('id', ParseUUIDPipe) id: string) {
    await this.about.removeEntry(positions, id);
  }

  // --- education ------------------------------------------------------------

  @Post('education')
  createEducation(@Body() dto: EducationDto) {
    return this.about.createEntry(education, dto);
  }

  @Put('education/:id')
  updateEducation(@Param('id', ParseUUIDPipe) id: string, @Body() dto: EducationDto) {
    return this.about.updateEntry(education, id, dto);
  }

  @Delete('education/:id')
  @HttpCode(204)
  async removeEducation(@Param('id', ParseUUIDPipe) id: string) {
    await this.about.removeEntry(education, id);
  }

  // --- certifications -------------------------------------------------------

  @Post('certifications')
  createCertification(@Body() dto: CertificationDto) {
    return this.about.createEntry(certifications, dto);
  }

  @Put('certifications/:id')
  updateCertification(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CertificationDto) {
    return this.about.updateEntry(certifications, id, dto);
  }

  @Delete('certifications/:id')
  @HttpCode(204)
  async removeCertification(@Param('id', ParseUUIDPipe) id: string) {
    await this.about.removeEntry(certifications, id);
  }
}
