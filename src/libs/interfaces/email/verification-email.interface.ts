import { Confirmation } from '@enums/confirmation-type.enum';

export interface VerificationEmailInterface {
  changingEmail?: string;
  to: string;
  confirmationType: Confirmation;
  userId: string;
}
