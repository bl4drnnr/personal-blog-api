import { Confirmation } from '@interfaces/confirmation-type.enum';

export interface EmailSettingsInterface {
  confirmationHash: string;
  confirmationType: Confirmation;
  userId: string;
}
