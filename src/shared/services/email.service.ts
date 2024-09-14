import * as SendGrid from '@sendgrid/mail';
import { CryptographicService } from '@shared/cryptographic.service';
import { ApiConfigService } from '@shared/config.service';
import { EmailTemplatesService } from '@shared/email-templates.service';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { SecurityInitEmailInterface } from '@interfaces/security-init-email.interface';
import { EmailSettingsInterface } from '@interfaces/email-settings.interface';
import { Routes } from '@interfaces/routes.enum';
import { GetConfirmLinkInterface } from '@interfaces/get-confirm-link.interface';
import { SendEmailInterface } from '@interfaces/send-email.interface';
import { EmailConfirmHashInterface } from '@interfaces/email-confirm-hash.interface';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CompletedSecurityEmailInterface } from '@interfaces/completed-security-email.interface';
import { SubscriptionConfirmationEmail } from '@interfaces/subscription-confirmation-email.interface';
import { ContactEmailInterface } from '@interfaces/contact-email.interface';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly cryptographicService: CryptographicService,
    private readonly emailTemplatesService: EmailTemplatesService,
    @Inject(forwardRef(() => ConfirmationHashService))
    private readonly confirmationHashService: ConfirmationHashService
  ) {
    SendGrid.setApiKey(this.configService.sendGridCredentials.apiKey);
  }

  async sendRegistrationConfirmationEmail({
    payload,
    userInfo,
    language,
    trx
  }: SecurityInitEmailInterface) {
    const confirmationHash =
      this.cryptographicService.generateConfirmationHash();

    const { confirmationType, userId, to } = payload;

    const emailSettings: EmailSettingsInterface = {
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx });

    const link = this.getConfirmationLink({
      hash: confirmationHash,
      route: Routes.ACCOUNT_CONFIRMATION
    });

    const { html, subject } =
      this.emailTemplatesService.registrationEmailTemplate({
        userInfo,
        link,
        language
      });

    await this.sendEmail({ to, html, subject });
  }

  async sendForgotPasswordEmail({
    payload,
    userInfo,
    language,
    trx
  }: SecurityInitEmailInterface) {
    const confirmationHash =
      this.cryptographicService.generateConfirmationHash();

    const { confirmationType, userId, to } = payload;

    const emailSettings: EmailSettingsInterface = {
      confirmationHash,
      confirmationType,
      userId
    };

    await this.createConfirmationHash({ emailSettings, trx });

    const link = this.getConfirmationLink({
      hash: confirmationHash,
      route: Routes.RESET_PASSWORD
    });

    const { html, subject } =
      this.emailTemplatesService.forgotPasswordEmailTemplate({
        userInfo,
        link,
        language
      });

    await this.sendEmail({ to, html, subject });
  }

  async sendResetPasswordCompleteEmail({
    to,
    userInfo,
    language
  }: CompletedSecurityEmailInterface) {
    const link = this.getConfirmationLink({
      route: Routes.LOGIN
    });

    const { html, subject } = this.emailTemplatesService.resetPasswordComplete({
      userInfo,
      language,
      link
    });

    await this.sendEmail({ to, html, subject });
  }

  async sendSubscriptionConfirmationEmail({
    to,
    newslettersId,
    language
  }: SubscriptionConfirmationEmail) {
    const link = this.getConfirmationLink({
      route: `${Routes.NEWSLETTERS_CONFIRMATION}/confirmation`,
      hash: newslettersId
    });

    const { html, subject } =
      this.emailTemplatesService.subscriptionConfirmation({
        language,
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
    return `${this.configService.frontEndUrl}/${route}${
      hash ? `/${hash}` : ''
    }`;
  }

  private async sendEmail({ to, subject, html }: SendEmailInterface) {
    const from = this.configService.sendGridCredentials.senderEmail;
    return await SendGrid.send({ from, to, subject, html });
  }

  private async createConfirmationHash({
    emailSettings,
    trx
  }: EmailConfirmHashInterface) {
    await this.confirmationHashService.createConfirmationHash({
      payload: { ...emailSettings },
      trx
    });
  }
}
