import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Mounts the OpenAPI document + Swagger UI at /api/docs (raw JSON at
 * /api/docs-json). Called from the real bootstrap only — the e2e harness skips
 * it to keep test startup lean. Set SWAGGER_ENABLED=false to disable in prod.
 */
export function setupSwagger(app: INestApplication): void {
  if (process.env.SWAGGER_ENABLED === 'false') {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Personal Blog API')
    .setDescription(
      'Content API for mikhailbahdashych.me — posts, full-text search, CV, site config, ' +
        'assets, and single-admin authentication. Admin endpoints require a Bearer access ' +
        'token obtained through the /auth flow.',
    )
    .setVersion('2.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .addCookieAuth('_rt', { type: 'apiKey', in: 'cookie', name: '_rt' })
    .addTag('Health', 'Liveness probe')
    .addTag('Auth', 'Login, MFA enrollment, token refresh')
    .addTag('Account', 'Authenticated account management')
    .addTag('Posts', 'Articles and projects (public reads + admin CRUD)')
    .addTag('Search', 'Full-text search across published posts')
    .addTag('About', 'CV: profile, work history, education, certifications')
    .addTag('Config', 'Site configuration (home hero, social links, SEO defaults)')
    .addTag('Assets', 'Image uploads backed by S3')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}
