import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { EmailService } from '@shared/email.service';
import { UsersModule } from '@modules/users.module';
import { CryptographicService } from '@shared/cryptographic.service';
import { TimeService } from '@shared/time.service';
import { EmailTemplatesService } from '@shared/email-templates.service';
import { SlugService } from '@shared/slug.service';

const providers = [
  ApiConfigService,
  EmailService,
  CryptographicService,
  TimeService,
  EmailTemplatesService,
  SlugService
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
  imports: [UsersModule]
})
export class SharedModule {}
