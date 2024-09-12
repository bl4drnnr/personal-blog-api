import { Module } from '@nestjs/common';
import { AboutBlogController } from './about-blog.controller';
import { AboutBlogService } from './about-blog.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Author } from '@models/author.model';
import { Experience } from '@models/experience.model';
import { ExperiencePosition } from '@models/experience-position.model';
import { Cert } from '@models/cert.model';
import { Social } from '@models/social.model';
import { AuthModule } from '@modules/auth.module';

@Module({
  controllers: [AboutBlogController],
  providers: [AboutBlogService],
  imports: [
    AuthModule,
    SequelizeModule.forFeature([
      Author,
      Experience,
      ExperiencePosition,
      Cert,
      Social
    ])
  ]
})
export class AboutBlogModule {}
