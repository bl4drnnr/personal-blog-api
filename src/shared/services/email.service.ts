import * as SendGrid from '@sendgrid/mail';
import { ApiConfigService } from '@shared/config.service';
import { EmailTemplatesService } from '@shared/email-templates.service';
import { Injectable } from '@nestjs/common';
import { ContactEmailInterface } from '@interfaces/contact-email.interface';
import { Routes } from '@interfaces/routes.enum';
import { GetConfirmLinkInterface } from '@interfaces/get-confirm-link.interface';
import { SendEmailInterface } from '@interfaces/send-email.interface';
import { SendSubscriptionConfirmationEmailInterface } from '@interfaces/send-subscription-confirmation-email.interface';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly emailTemplatesService: EmailTemplatesService
  ) {
    SendGrid.setApiKey(this.configService.sendGridCredentials.apiKey);
  }

  async sendSubscriptionConfirmationEmail({
    to,
    newslettersId
  }: SendSubscriptionConfirmationEmailInterface) {
    const link = this.getConfirmationLink({
      route: `${Routes.NEWSLETTERS_CONFIRMATION}/confirmation`,
      hash: newslettersId
    });

    const { html, subject } = this.emailTemplatesService.subscriptionConfirmation({
      link
    });

    await this.sendEmail({ to, html, subject });
  }

  async contact({ name, message, email }: ContactEmailInterface) {
    const contactEmailAddress = this.configService.contactEmailAddress;

    const { html, subject } = this.emailTemplatesService.contactEmailTemplate({
      name,
      message,
      email
    });

    await this.sendEmail({
      to: contactEmailAddress,
      html,
      subject
    });
  }

  private getConfirmationLink({ hash, route }: GetConfirmLinkInterface) {
    return `${this.configService.frontEndUrl}/${route}${hash ? `/${hash}` : ''}`;
  }

  private async sendEmail({ to, subject, html }: SendEmailInterface) {
    const from = this.configService.sendGridCredentials.senderEmail;
    return await SendGrid.send({ from, to, subject, html });
  }
}
