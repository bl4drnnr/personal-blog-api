import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';
import { registrationTemplate } from '@email-templates/registration.template';
import { EmailTemplateInterface } from '@interfaces/email-template.interface';
import { forgotPasswordTemplate } from '@email-templates/forgot-password.template';
import { Injectable } from '@nestjs/common';
import { Language } from '@interfaces/language.enum';
import { resetPassCompletedTemplate } from '@email-templates/reset-pass-completed.template';

@Injectable()
export class EmailTemplatesService {
  registrationEmailTemplate({
    userInfo,
    link,
    language
  }: SecurityPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = 'MBPB - Registration confirmation';
        break;
      case Language.RU:
        subject = 'MBPB - Подтверждение регистрации';
        break;
      case Language.PL:
        subject = 'MBPB - Potwierdzenie rejestracji';
        break;
      default:
        subject = 'MBPB - Registration confirmation';
        break;
    }

    const html = registrationTemplate({
      userInfo,
      link,
      language
    });

    return { html, subject };
  }

  forgotPasswordEmailTemplate({
    userInfo,
    link,
    language
  }: SecurityPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = 'MBPB - Password reset';
        break;
      case Language.RU:
        subject = 'MBPB - Восстановление пароля';
        break;
      case Language.PL:
        subject = 'MBPB - Przypomnienie hasła';
        break;
      default:
        subject = 'MBPB - Password reset';
        break;
    }

    const html = forgotPasswordTemplate({
      userInfo,
      link,
      language
    });

    return { html, subject };
  }

  resetPasswordComplete({
    userInfo,
    link,
    language
  }: SecurityPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case Language.EN:
        subject = 'MBPB - Password successfully reset';
        break;
      case Language.RU:
        subject = 'MBPB - Пароль сброшен';
        break;
      case Language.PL:
        subject = 'MBPB - Hasło zresetowane';
        break;
      default:
        subject = 'MBPB - Password successfully reset';
        break;
    }

    const html = resetPassCompletedTemplate({
      userInfo,
      link,
      language
    });

    return { html, subject };
  }
}
