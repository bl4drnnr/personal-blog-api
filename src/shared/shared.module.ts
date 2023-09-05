import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { CryptographicService } from '@shared/cryptographic.service';
import { EmailService } from '@shared/email.service';
import { EmailTemplatesService } from '@shared/email-templates.service';
import {ConfirmationHashModule} from "@confirmation-hash/confirmation-hash.module";

const providers = [
  ApiConfigService,
  CryptographicService,
  EmailService,
  EmailTemplatesService
];

@Global()
@Module({
  providers,
  exports: [...providers],
  imports: [ConfirmationHashModule]
})
export class SharedModule {}
