import { Confirmation } from '@interfaces/confirmation-type.enum';

export interface VerificationEmailInterface {
  to: string;
  confirmationType: Confirmation;
  userId: string;
}
