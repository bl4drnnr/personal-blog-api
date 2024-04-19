import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Transaction } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { Session } from '@models/session.model';
import { UserSettings } from '@models/user-settings.model';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { TransactionInterceptor } from '@interceptors/transaction.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from '@modules/users/users.module';
import { ConfirmationHashModule } from '@modules/confirmation-hash/confirmation-hash.module';
import TYPES = Transaction.TYPES;
import { SharedModule } from '@shared/shared.module';
import { SecurityModule } from '@modules/security.module';
import { RecoveryModule } from '@modules/recovery.module';
import { PostsModule } from '@modules/posts/posts.module';
import { PostModel } from '@models/post.model';

@Module({
  imports: [
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
      // dialectOptions: {
      //   ssl: {
      //     require: true,
      //     rejectUnauthorized: false
      //   }
      // },
      transactionType: TYPES.EXCLUSIVE,
      models: [User, Session, UserSettings, ConfirmationHash, PostModel],
      autoLoadModels: true
    }),
    AuthModule,
    UsersModule,
    ConfirmationHashModule,
    SharedModule,
    SecurityModule,
    RecoveryModule,
    PostsModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor
    }
  ]
})
export class AppModule {}
