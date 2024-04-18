import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';
import { registrationTemplate } from '@email-templates/registration.template';
import { EmailTemplateInterface } from '@interfaces/email-template.interface';
import { forgotPasswordTemplate } from '@email-templates/forgot-password.template';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailTemplatesService {
  registrationEmailTemplate({
    userInfo,
    link
  }: SecurityPayloadInterface): EmailTemplateInterface {
    const subject = 'MBPB - Registration confirmation';

    const html = registrationTemplate({
      userInfo,
      link
    });

    return { html, subject };
  }

  forgotPasswordEmailTemplate({
    userInfo,
    link
  }: SecurityPayloadInterface): EmailTemplateInterface {
    const subject = 'MBPB - Password reset';

    const html = forgotPasswordTemplate({
      userInfo,
      link
    });

    return { html, subject };
  }
}
