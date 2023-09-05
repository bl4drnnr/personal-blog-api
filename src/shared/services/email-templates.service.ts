import { Injectable } from '@nestjs/common';
import { registrationTemplate } from '@email-templates/registration.template';
import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';
import { EmailTemplateInterface } from '@interfaces/email-template.interface';

@Injectable()
export class EmailTemplatesService {
  registrationEmailTemplate({
    link,
    language
  }: SecurityPayloadInterface): EmailTemplateInterface {
    const subject = 'MBB - Registration confirmation';

    const html = registrationTemplate({
      link,
      language
    });

    return { html, subject };
  }
}
