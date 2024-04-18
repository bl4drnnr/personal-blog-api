import { UserSettings } from '@models/user-settings.model';

export interface CheckMfaStatusInterface {
  mfaCode: string;
  userSettings: UserSettings;
}
