import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DbModule } from './db/db.module';
import { AboutModule } from './modules/about/about.module';
import { AssetsModule } from './modules/assets/assets.module';
import { AuthModule } from './modules/auth/auth.module';
import { SiteConfigModule } from './modules/config/config.module';
import { HealthModule } from './modules/health/health.module';
import { PostsModule } from './modules/posts/posts.module';
import { RevalidateModule } from './modules/revalidate/revalidate.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    DbModule,
    RevalidateModule,
    AuthModule,
    PostsModule,
    SearchModule,
    AssetsModule,
    AboutModule,
    SiteConfigModule,
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
