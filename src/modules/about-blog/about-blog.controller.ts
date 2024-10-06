import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { AboutBlogService } from '@modules/about-blog.service';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/auth.guard';
import { CreateAuthorDto } from '@dto/create-author.dto';
import { UserId } from '@decorators/user-id.decorator';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ChangeAuthorSelectionStatusDto } from '@dto/change-author-selection-status.dto';
import { UpdateAuthorDto } from '@dto/update-author.dto';
import { CreateExperienceDto } from '@dto/create-experience.dto';
import { UpdateExperienceDto } from '@dto/update-experience.dto';
import { CreateCertificationDto } from '@dto/create-certification.dto';
import { UpdateCertificationDto } from '@dto/update-certification.dto';
import { ChangeExperienceSelectionStatusDto } from '@dto/change-experience-selection-status.dto';
import { ChangeCertificationSelectionStatusDto } from '@dto/change-certification-selection-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateExperiencePositionDto } from '@dto/create-experience-position.dto';
import { UpdateExperiencePositionDto } from '@dto/update-experience-position.dto';
import { CreateSocialDto } from '@dto/create-social.dto';
import { UpdateSocialDto } from '@dto/update-social.dto';

@Controller('about-blog')
export class AboutBlogController {
  constructor(private readonly aboutBlogService: AboutBlogService) {}

  @Get('get-selected-author')
  getSelectedAuthor(
    @Query('authorLanguage') authorLanguage: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.getSelectedAuthor({ authorLanguage, trx });
  }

  @UseGuards(AuthGuard)
  @Get('list-authors')
  listAuthors(
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('order') order: string,
    @Query('orderBy') orderBy: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.listAuthors({
      query,
      page,
      pageSize,
      order,
      orderBy,
      trx
    });
  }

  @UseGuards(AuthGuard)
  @Get('list-experiences')
  listExperiences(
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('order') order: string,
    @Query('orderBy') orderBy: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.listExperiences({
      query,
      page,
      pageSize,
      order,
      orderBy,
      trx
    });
  }

  @UseGuards(AuthGuard)
  @Get('list-certifications')
  listCertifications(
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('order') order: string,
    @Query('orderBy') orderBy: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.listCertifications({
      query,
      page,
      pageSize,
      order,
      orderBy,
      trx
    });
  }

  @UseGuards(AuthGuard)
  @Get('get-author-by-id')
  getAuthorById(
    @Query('authorId') authorId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.authorById({ authorId, trx });
  }

  @UseGuards(AuthGuard)
  @Get('get-experience-by-id')
  getExperienceById(
    @Query('experienceId') experienceId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.getExperienceById({
      experienceId,
      trx
    });
  }

  @UseGuards(AuthGuard)
  @Get('get-certification-by-id')
  getCertificationById(
    @Query('certificationId') certificationId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.getCertificationById({
      certificationId,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('create-author')
  createAuthor(
    @UserId() userId: string,
    @Body() payload: CreateAuthorDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.createAuthor({
      userId,
      payload,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('create-social')
  createSocial(@Body() payload: CreateSocialDto, @TrxDecorator() trx: Transaction) {
    return this.aboutBlogService.createSocial({ payload, trx });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('create-experience')
  createExperience(
    @Body() payload: CreateExperienceDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.createExperience({ payload, trx });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('create-experience-position')
  createExperiencePosition(
    @Body() payload: CreateExperiencePositionDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.createExperiencePosition({
      payload,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('create-certification')
  createCertification(
    @Body() payload: CreateCertificationDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.createCertification({
      payload,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('update-author')
  updateAuthor(@Body() payload: UpdateAuthorDto, @TrxDecorator() trx: Transaction) {
    return this.aboutBlogService.updateAuthor({ payload, trx });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('update-social')
  updateSocial(@Body() payload: UpdateSocialDto, @TrxDecorator() trx: Transaction) {
    return this.aboutBlogService.updateSocial({ payload, trx });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('update-experience')
  updateExperience(
    @Body() payload: UpdateExperienceDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.updateExperience({ payload, trx });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('update-experience-position')
  updateExperiencePosition(
    @Body() payload: UpdateExperiencePositionDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.updateExperiencePosition({
      payload,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('update-certification')
  updateCertification(
    @Body() payload: UpdateCertificationDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.updateCertification({
      payload,
      trx
    });
  }

  @UseGuards(AuthGuard)
  @Delete('delete-author')
  deleteAuthor(
    @Query('authorCommonId') authorCommonId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.deleteAuthor({ authorCommonId, trx });
  }

  @UseGuards(AuthGuard)
  @Delete('delete-social')
  deleteSocial(
    @Query('socialId') socialId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.deleteSocial({ socialId, trx });
  }

  @UseGuards(AuthGuard)
  @Delete('delete-experience')
  deleteExperience(
    @Query('experienceId') experienceId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.deleteExperience({
      experienceId,
      trx
    });
  }

  @UseGuards(AuthGuard)
  @Delete('delete-experience-position')
  deleteExperiencePosition(
    @Query('experiencePositionId') experiencePositionId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.deleteExperiencePosition({
      experiencePositionId,
      trx
    });
  }

  @UseGuards(AuthGuard)
  @Delete('delete-certification')
  deleteCertification(
    @Query('certCommonId') certCommonId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.deleteCertification({
      certCommonId,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('change-author-selection-status')
  changeAuthorSelectionStatus(
    @Body() payload: ChangeAuthorSelectionStatusDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.changeAuthorSelectionStatus({
      payload,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('change-experience-selection-status')
  changeExperienceSelectionStatus(
    @Body() payload: ChangeExperienceSelectionStatusDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.changeExperienceSelectionStatus({
      payload,
      trx
    });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('change-certification-selection-status')
  changeCertificationSelectionStatus(
    @Body() payload: ChangeCertificationSelectionStatusDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.aboutBlogService.changeCertificationSelectionStatus({
      payload,
      trx
    });
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('certificateFile', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/\/(pdf)$/)) {
          return callback(new Error('Only PDF files are allowed!'), false);
        }
        callback(null, true);
      }
    })
  )
  @Post('certification-file-upload')
  certificationFileUpload(@UploadedFile() payload: Express.Multer.File) {
    return this.aboutBlogService.certificationFileUpload(payload);
  }
}
