import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from '@models/project.model';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [SequelizeModule.forFeature([Project])]
})
export class ProjectsModule {}
