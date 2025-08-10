import * as SendGrid from '@sendgrid/mail';
import { ApiConfigService } from '@shared/config.service';
import { EmailTemplatesService } from '@shared/email-templates.service';
import { Injectable } from '@nestjs/common';
import { Routes } from '@interfaces/routes.enum';
import { GetConfirmLinkInterface } from '@interfaces/get-confirm-link.interface';
import { SendEmailInterface } from '@interfaces/send-email.interface';
import { SendSubscriptionConfirmationEmailInterface } from '@interfaces/send-subscription-confirmation-email.interface';
import { SendReplyToUserInterface } from '@interfaces/send-reply-to-user.interface';

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
      route: Routes.NEWSLETTERS_CONFIRMATION,
      hash: newslettersId
    });

    const unsubscribeLink = this.getConfirmationLink({
      route: Routes.NEWSLETTERS_UNSUBSCRIBE,
      hash: newslettersId
    });

    const { html, subject } = this.emailTemplatesService.subscriptionConfirmation({
      link,
      unsubscribeLink
    });

    await this.sendEmail({ to, html, subject });
  }

  async sendReplyToUser({
    to,
    userMessage,
    reply,
    subject
  }: SendReplyToUserInterface) {
    const { html } = this.emailTemplatesService.contactReplyTemplate({
      userMessage,
      reply
    });

    await this.sendEmail({
      to,
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
