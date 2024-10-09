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
import { ArticlesModule } from '@modules/articles.module';
import { ArticleModel } from '@models/article.model';
import { CategoryModel } from '@models/category.model';
import { CategoriesModule } from '@modules/categories.module';
import { EndUser } from '@models/end-user.model';
import { Newsletter } from '@models/newsletters.model';
import { NewslettersModule } from '@modules/newsletters.module';
import { EndUserModule } from '@modules/end-user.module';
import { AboutBlogModule } from '@modules/about-blog/about-blog.module';
import { Author } from '@models/author.model';
import { ExperiencePosition } from '@models/experience-position.model';
import { Cert } from '@models/cert.model';
import { Experience } from '@models/experience.model';
import { Social } from '@models/social.model';
import { ContactModule } from './modules/contact/contact.module';
import { PagesContent } from '@models/pages-content.model';

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
      models: [
        User,
        Session,
        UserSettings,
        ConfirmationHash,
        ArticleModel,
        CategoryModel,
        EndUser,
        Newsletter,
        Author,
        Experience,
        ExperiencePosition,
        Cert,
        Social,
        PagesContent
      ],
      autoLoadModels: true
    }),
    AuthModule,
    UsersModule,
    ConfirmationHashModule,
    SharedModule,
    SecurityModule,
    RecoveryModule,
    ArticlesModule,
    CategoriesModule,
    NewslettersModule,
    EndUserModule,
    AboutBlogModule,
    ContactModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor
    }
  ]
})
export class AppModule {}
