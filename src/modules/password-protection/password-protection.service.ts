import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { PasswordProtectionMode } from '@models/password-protection-mode.model';
import { Session } from '@models/session.model';
import { StaticAssetModel } from '@models/static-asset.model';
import { CryptographicService } from '@shared/cryptographic.service';
import { ApiConfigService } from '@shared/config.service';
import { VerifyPasswordInterface } from '@interfaces/verify-password.interface';
import { UpdatePasswordProtectionInterface } from '@interfaces/update-password-protection.interface';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { PasswordProtectionDisabledException } from '@exceptions/password-protection-disabled.exception';

@Injectable()
export class PasswordProtectionService {
  constructor(
    @InjectModel(PasswordProtectionMode)
    private readonly passwordProtectionRepository: typeof PasswordProtectionMode,
    @InjectModel(Session)
    private readonly sessionRepository: typeof Session,
    private readonly jwtService: JwtService,
    private readonly cryptographicService: CryptographicService,
    private readonly configService: ApiConfigService
  ) {}

  async getPasswordProtectionStatus() {
    const settings = await this.passwordProtectionRepository.findOne({
      attributes: ['isActive', 'heroTitle', 'footerText', 'metaTitle'],
      include: [
        {
          model: StaticAssetModel,
          as: 'heroImage',
          attributes: ['id', 's3Url']
        }
      ]
    });

    if (!settings) {
      return {
        isActive: false,
        heroTitle: 'Site Protected',
        footerText: 'Please contact administrator for access',
        heroImage: null,
        metaTitle: 'Site Protected'
      };
    }

    return {
      isActive: settings.isActive,
      heroTitle: settings.heroTitle,
      footerText: settings.footerText,
      heroImage: settings.heroImage.s3Url,
      metaTitle: settings.metaTitle
    };
  }

  async verifyPassword({ password, trx }: VerifyPasswordInterface) {
    const settings = await this.passwordProtectionRepository.findOne({
      transaction: trx
    });

    if (!settings || !settings.isActive) {
      throw new PasswordProtectionDisabledException();
    }

    const isPasswordValid = await this.cryptographicService.comparePasswords({
      dataToCompare: password,
      hash: settings.password
    });

    if (!isPasswordValid) {
      throw new WrongCredentialsException();
    }

    // WATCH OUT! UNSAFE HERE
    // Generate password protection access token
    const accessToken = this.generatePasswordProtectionToken({
      userId: settings.userId,
      durationHours: settings.durationHours
    });

    // Store session with password-protection type
    const tokenId = uuid.v4();
    await this.sessionRepository.create(
      {
        userId: settings.userId,
        tokenId,
        tokenType: 'password-protection'
      },
      { transaction: trx }
    );

    return {
      accessToken,
      expiresIn: settings.durationHours * 3600 // Convert to seconds
    };
  }

  async getPasswordProtectionModeAdmin() {
    const settings = await this.passwordProtectionRepository.findOne({
      include: [
        {
          model: StaticAssetModel,
          as: 'heroImage',
          attributes: ['id', 's3Url']
        }
      ]
    });

    // TODO: DO THE SAME AS WITH MAINTENANCE MODE
    if (!settings) {
      return {
        isActive: false,
        durationHours: 24,
        heroImageId: '',
        heroTitle: 'Site Protected',
        footerText: 'Please contact administrator for access',
        metaTitle: 'Site Protected'
      };
    }

    return {
      isActive: settings.isActive,
      durationHours: settings.durationHours,
      heroImageId: settings.heroImageId,
      heroTitle: settings.heroTitle,
      footerText: settings.footerText,
      metaTitle: settings.metaTitle
    };
  }

  async updatePasswordProtectionMode({
    data,
    userId,
    trx
  }: UpdatePasswordProtectionInterface) {
    const {
      isActive,
      password,
      durationHours,
      heroImageId,
      heroTitle,
      footerText,
      metaTitle
    } = data;

    let hashedPassword = '';
    if (password) {
      hashedPassword = await this.cryptographicService.hashPassword({ password });
    }

    const existingSettings = await this.passwordProtectionRepository.findOne({
      transaction: trx
    });

    if (existingSettings) {
      // Update existing settings
      await this.passwordProtectionRepository.update(
        {
          isActive,
          ...(password && { password: hashedPassword }),
          durationHours,
          heroImageId,
          heroTitle,
          footerText,
          metaTitle,
          userId
        },
        {
          where: { id: existingSettings.id },
          transaction: trx
        }
      );

      // If deactivating, remove all password-protection sessions
      if (!isActive) {
        await this.sessionRepository.destroy({
          where: { tokenType: 'password-protection' },
          transaction: trx
        });
      }
    } else {
      // Create new settings
      await this.passwordProtectionRepository.create(
        {
          isActive,
          password: hashedPassword,
          durationHours,
          heroImageId,
          heroTitle,
          footerText,
          metaTitle
        },
        { transaction: trx }
      );
    }

    return { success: true };
  }

  private generatePasswordProtectionToken({
    userId,
    durationHours
  }: {
    userId: string;
    durationHours: number;
  }) {
    const payload = {
      userId,
      type: 'password-protection'
    };

    const options = {
      expiresIn: `${durationHours}h`,
      secret: this.configService.jwtAuthConfig.secret
    };

    return this.jwtService.sign(payload, options);
  }
}
