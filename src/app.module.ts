import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Transaction } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { Session } from '@models/session.model';
import { UserSettings } from '@models/user-settings.model';
import { TransactionInterceptor } from '@interceptors/transaction.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from '@modules/users/users.module';
import TYPES = Transaction.TYPES;
import { SharedModule } from '@shared/shared.module';
import { SecurityModule } from '@modules/security/security.module';
import { ArticlesModule } from '@modules/articles/articles.module';
import { ArticleModel } from '@models/article.model';
import { Newsletter } from '@models/newsletters.model';
import { SubscribePage } from '@models/subscribe-page.model';
import { NewslettersModule } from '@modules/newsletters/newsletters.module';
import { ContactModule } from '@modules/contact/contact.module';
import { PagesContent } from '@models/pages-content.model';
import { ControlModule } from '@modules/control/control.module';
import { ProjectsModule } from '@modules/projects/projects.module';
import { ProjectModel } from '@models/project.model';
import { SiteConfigModule } from '@modules/site-config/site-config.module';
import { SiteConfigModel } from '@models/site-config.model';
import { PagesModule } from '@modules/pages/pages.module';
import { PageModel } from '@models/page.model';
import { AboutModule } from '@modules/about/about.module';
import { AboutPage } from '@models/about-page.model';
import { Experience } from '@models/experience.model';
import { Position } from '@models/position.model';
import { Certificate } from '@models/certificate.model';
import { ChangelogModule } from '@modules/changelog/changelog.module';
import { ChangelogPage } from '@models/changelog-page.model';
import { ChangelogEntry } from '@models/changelog-entry.model';
import { LicenseModule } from '@modules/license/license.module';
import { LicensePage } from '@models/license-page.model';
import { LicenseTile } from '@models/license-tile.model';
import { PrivacyModule } from '@modules/privacy/privacy.module';
import { PrivacyPage } from '@models/privacy-page.model';
import { PrivacySection } from '@models/privacy-section.model';
import { HomePage } from '@models/home-page.model';
import { ContactPage } from '@models/contact-page.model';
import { ContactTile } from '@models/contact-tile.model';
import { HomeModule } from '@modules/home/home.module';
import { BlogPage } from '@models/blog-page.model';
import { ProjectsPage } from '@models/projects-page.model';
import { Faq } from '@models/faq.model';
import { WhysSection } from '@models/whys-section.model';
import { StaticAssetsModule } from '@modules/static-assets/static-assets.module';
import { StaticAssetModel } from '@models/static-asset.model';
import { FaqModule } from '@modules/faq/faq.module';
import { MenuPage } from '@models/menu-page.model';
import { MenuTile } from '@models/menu-tile.model';
import { MenuModule } from '@modules/menu/menu.module';
import { ContactMessage } from '@models/contact-message.model';
import { MaintenanceMode } from '@models/maintenance-mode.model';
import { MaintenanceModule } from '@modules/maintenance/maintenance.module';
import { PasswordProtectionMode } from '@models/password-protection-mode.model';
import { PasswordProtectionModule } from '@modules/password-protection/password-protection.module';

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
        ArticleModel,
        ProjectModel,
        Newsletter,
        SubscribePage,
        PagesContent,
        SiteConfigModel,
        PageModel,
        AboutPage,
        Experience,
        Position,
        Certificate,
        ChangelogPage,
        ChangelogEntry,
        LicensePage,
        LicenseTile,
        PrivacyPage,
        PrivacySection,
        HomePage,
        ContactPage,
        ContactTile,
        BlogPage,
        ProjectsPage,
        Faq,
        WhysSection,
        StaticAssetModel,
        MenuPage,
        MenuTile,
        ContactMessage,
        MaintenanceMode,
        PasswordProtectionMode
      ],
      autoLoadModels: true
    }),
    AuthModule,
    UsersModule,
    SharedModule,
    SecurityModule,
    ArticlesModule,
    ProjectsModule,
    NewslettersModule,
    ContactModule,
    ControlModule,
    SiteConfigModule,
    PagesModule,
    AboutModule,
    ChangelogModule,
    LicenseModule,
    PrivacyModule,
    HomeModule,
    StaticAssetsModule,
    FaqModule,
    MenuModule,
    MaintenanceModule,
    PasswordProtectionModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor
    }
  ]
})
export class AppModule {}
