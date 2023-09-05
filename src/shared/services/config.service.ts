import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  private getArray(key: string): Array<string> {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n').split(',');
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    return Number(value);
  }

  get orderOptions() {
    return {
      orderByOptions: this.getArray('ORDER_BY_OPTIONS'),
      orderOptions: this.getArray('ORDER_OPTIONS'),
      postTypeOptions: this.getArray('POST_TYPE_OPTION')
    };
  }

  get basicAuthConfig() {
    return {
      username: this.getString('BASIC_AUTH_USERNAME'),
      password: this.getString('BASIC_AUTH_PASSWORD')
    };
  }

  get jwtAuthConfig() {
    return {
      accessExpiresIn: this.getString('JWT_ACCESS_EXPIRES_IN'),
      refreshExpiresIn: this.getString('JWT_REFRESH_EXPIRES_IN'),
      secret: this.getString('JWT_SECRET')
    };
  }

  get adminFrontEndUrl() {
    return this.getString('ADMIN_FRONT_END_URL');
  }

  get hashPasswordRounds() {
    return this.getNumber('HASH_PASSWORD_ROUNDS');
  }

  get recoveryEncryptionData() {
    return {
      iterations: this.getNumber('RECOVERY_ENCRYPTION_ITERATIONS'),
      recoveryKeySize: this.getNumber('RECOVERY_ENCRYPTION_KEY_SIZE'),
      salt: this.getString('RECOVERY_ENCRYPTION_SALT'),
      iv: this.getString('RECOVERY_ENCRYPTION_IV')
    };
  }
}
