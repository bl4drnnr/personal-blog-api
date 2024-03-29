import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { TransactionInterceptor } from '@interceptors/transaction.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Transaction } from 'sequelize';
import TYPES = Transaction.TYPES;
import { UserSettings } from '@models/user-settings.model';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { ConfirmationHashModule } from '@confirmation-hash/confirmation-hash.module';
import { SecurityModule } from '@security/security.module';
import { RecoveryModule } from '@recovery/recovery.module';

@Module({
  imports: [
    PostsModule,
    SharedModule,
    UsersModule,
    AuthModule,
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
      models: [Post, User, Session, UserSettings, ConfirmationHash],
      autoLoadModels: true,
      transactionType: TYPES.EXCLUSIVE
    }),
    ConfirmationHashModule,
    SecurityModule,
    RecoveryModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BasicAuthMiddleware).forRoutes('*');
  }
}
