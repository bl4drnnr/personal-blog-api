export class RecoveryKeysResponseDto {
  readonly recoveryKeys: Array<string>;

  constructor(recoveryKeys: Array<string>) {
    this.recoveryKeys = recoveryKeys;
  }
}
