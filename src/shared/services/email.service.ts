import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import * as SendGrid from '@sendgrid/mail';
import { ConfirmationHashService } from '@confirmation-hash/confirmation-hash.service';
import { EmailTemplatesService } from '@shared/email-templates.service';
import { SecurityInitEmailInterface } from '@interfaces/security-init-email.interface';
import { SendEmailInterface } from '@interfaces/send-email.interface';
import { EmailConfirmHashInterface } from '@interfaces/email-confirm-hash.interface';
import { GetConfirmLinkInterface } from '@interfaces/get-confirm-link.interface';
import { EmailSettingsInterface } from '@interfaces/email-settings.interface';
import { CryptographicService } from '@shared/cryptographic.service';
import { Routes } from '@enums/routes.enum';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly cryptographicService: CryptographicService,
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly confirmationHashService: ConfirmationHashService
  ) {
    SendGrid.setApiKey(this.configService.sendGridCredentials.apiKey);
  }

  async sendRegistrationConfirmationEmail({
    payload,
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
        link,
        language
      });

    await this.sendEmail({ to, html, subject });
  }

  private getConfirmationLink({ hash, route }: GetConfirmLinkInterface) {
    return `${this.configService.adminFrontEndUrl}/${route}${
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
