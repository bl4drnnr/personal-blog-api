import { Language } from '@enums/language.enum';

export interface CompletedSecurityEmailInterface {
  to: string;
  language?: Language;
}
