import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from '@models/project.model';
import { AuthModule } from '@auth/auth.module';

@Module({
  providers: [ProjectsService],
  controllers: [ProjectsController],
  imports: [SequelizeModule.forFeature([Project]), AuthModule],
  exports: [ProjectsService]
})
export class ProjectsModule {}
