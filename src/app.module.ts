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

@Module({
  imports: [
    PostsModule,
    SharedModule,
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
      models: [Post],
      autoLoadModels: true
    })
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BasicAuthMiddleware).forRoutes({
      path: '/api/*',
      method: RequestMethod.ALL
    });
  }
}
