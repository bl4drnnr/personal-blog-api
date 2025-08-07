import { EmailTemplateInterface } from '@interfaces/email-template.interface';
import { subscriptionTemplate } from '@email-templates/subscription.template';
import { ContactEmailInterface } from '@interfaces/contact-email.interface';
import { contactTemplate } from '@email-templates/contact/contact.template';
import { Injectable } from '@nestjs/common';
import { SubscriptionConfirmationInterface } from '@interfaces/templates/subscription-confirmation.interface';

@Injectable()
export class EmailTemplatesService {
  subscriptionConfirmation({
    link
  }: SubscriptionConfirmationInterface): EmailTemplateInterface {
    const subject = 'Personal Blog - Subscription Confirmation';
    const html = subscriptionTemplate({ link });
    return { html, subject };
  }

  contactEmailTemplate({
    message,
    email,
    name
  }: ContactEmailInterface): EmailTemplateInterface {
    const subject = `Personal Blog - ${name} / ${email} has sent you a message!`;
    const html = contactTemplate({ message, email, name });
    return { html, subject };
  }
}
