import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from '@models/project.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@auth/auth.service';
import { Session } from '@models/session.model';
import { User } from '@models/user.model';

@Module({
  providers: [ProjectsService, AuthService],
  controllers: [ProjectsController],
  imports: [SequelizeModule.forFeature([Project, User, Session]), JwtModule]
})
export class ProjectsModule {}
