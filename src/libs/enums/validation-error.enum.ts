export enum ValidationError {
  WRONG_EMAIL_FORMAT = 'wrong-email-format',
  WRONG_PASSWORD_FORMAT = 'wrong-password-format',
  WRONG_AUTH_TOKEN = 'wrong-authentication-token',
  WRONG_MFA_CODE_FORMAT = 'mfa-code-should-be-6-digit-code',
  WRONG_TWO_FA_TOKEN_FORMAT = 'wrong-two-fa-token-format',
  WRONG_TWO_FA_TOKEN_LENGTH = 'wrong-two-fa-token-length',
  WRONG_PASSPHRASE_FORMAT = 'wrong-passphrase-format',
  WRONG_PASSPHRASE_LENGTH = 'wrong-passphrase-length',
  WRONG_REC_KEYS = 'corrupted-recovery-keys'
}
