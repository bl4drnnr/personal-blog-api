import { Confirmation } from '@enums/confirmation-type.enum';

export interface EmailSettingsInterface {
  changingEmail?: string;
  confirmationHash: string;
  confirmationType: Confirmation;
  userId: string;
}
