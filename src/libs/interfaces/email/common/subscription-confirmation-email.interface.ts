import { Language } from '@interfaces/language.enum';

export interface SubscriptionConfirmationEmail {
  to: string;
  newslettersId: string;
  language?: Language;
}
