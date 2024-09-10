import { Language } from '@interfaces/language.enum';

export interface NewslettersSubscriptionPayloadInterface {
  link: string;
  language?: Language;
}
