import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { PostsModule } from '@posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { BasicAuthMiddleware } from '@middlewares/basic-auth.middleware';
import { SharedModule } from '@shared/shared.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from '@models/post.model';
import { UsersModule } from '@users/users.module';
import { User } from '@models/user.model';
import { AuthModule } from '@auth/auth.module';
import { Session } from '@models/session.model';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { SignUpMiddleware } from '@middlewares/sign-up.middleware';
import { ProjectsModule } from '@projects/projects.module';
import { Project } from '@models/project.model';

@Module({
  imports: [
    PostsModule,
    SharedModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      models: [Post, User, Session, ConfirmationHash, Project],
      autoLoadModels: true
    })
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignUpMiddleware).forRoutes({
      path: '/users/sign-up',
      method: RequestMethod.POST
    });
    consumer.apply(BasicAuthMiddleware).forRoutes({
      path: '(.*)',
      method: RequestMethod.ALL
    });
  }
}
