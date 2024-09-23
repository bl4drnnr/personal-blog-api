import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';
import { registrationTemplate } from '@email-templates/registration.template';
import { EmailTemplateInterface } from '@interfaces/email-template.interface';
import { forgotPasswordTemplate } from '@email-templates/forgot-password.template';
import { Injectable } from '@nestjs/common';
import { Language } from '@interfaces/language.enum';
import { resetPassCompletedTemplate } from '@email-templates/reset-pass-completed.template';
import { NewslettersSubscriptionPayloadInterface } from '@interfaces/newsletters-subscription-payload.interface';
import { subscriptionTemplate } from '@email-templates/subscription.template';
import { ContactEmailInterface } from '@interfaces/contact-email.interface';
import { contactTemplate } from '@email-templates/contact/contact.template';

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
        subject =
          'Bahdashych on Security - Registration confirmation';
        break;
      case Language.RU:
        subject =
          'Bahdashych on Security - Подтверждение регистрации';
        break;
      case Language.PL:
        subject =
          'Bahdashych on Security - Potwierdzenie rejestracji';
        break;
      default:
        subject =
          'Bahdashych on Security - Registration confirmation';
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
        subject = 'Bahdashych on Security - Password reset';
        break;
      case Language.RU:
        subject = 'Bahdashych on Security - Восстановление пароля';
        break;
      case Language.PL:
        subject = 'Bahdashych on Security - Przypomnienie hasła';
        break;
      default:
        subject = 'Bahdashych on Security - Password reset';
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
        subject =
          'Bahdashych on Security - Password successfully reset';
        break;
      case Language.RU:
        subject = 'Bahdashych on Security - Пароль сброшен';
        break;
      case Language.PL:
        subject = 'Bahdashych on Security - Hasło zresetowane';
        break;
      default:
        subject =
          'Bahdashych on Security - Password successfully reset';
        break;
    }

    const html = resetPassCompletedTemplate({
      userInfo,
      link,
      language
    });

    return { html, subject };
  }

  subscriptionConfirmation({
    language,
    link
  }: NewslettersSubscriptionPayloadInterface): EmailTemplateInterface {
    let subject: string;

    switch (language) {
      case Language.EN:
        subject =
          'Bahdashych on Security - Subscription Confirmation';
        break;
      case Language.RU:
        subject = 'Bahdashych on Security - Подтверждение подписки';
        break;
      case Language.PL:
        subject =
          'Bahdashych on Security - Potwierdzenie subskrypcji';
        break;
      default:
        subject =
          'Bahdashych on Security - Subscription Confirmation';
        break;
    }

    const html = subscriptionTemplate({
      link,
      language
    });

    return { html, subject };
  }

  contactEmailTemplate({
    message,
    email,
    name
  }: ContactEmailInterface): EmailTemplateInterface {
    const subject = `Bahdashych on Security - ${name} / ${email} has send you a message!`;

    const html = contactTemplate({
      message,
      email,
      name
    });

    return { html, subject };
  }
}
