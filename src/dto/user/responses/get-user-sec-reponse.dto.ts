export class GetUserSecResponseDto {
  readonly passwordCanBeChanged: boolean;
  readonly isTwoFaSetUp: boolean;
  readonly email: string;

  constructor({
    passwordCanBeChanged,
    isTwoFaSetUp,
    email
  }: {
    passwordCanBeChanged: boolean;
    isTwoFaSetUp: boolean;
    email: string;
  }) {
    this.passwordCanBeChanged = passwordCanBeChanged;
    this.isTwoFaSetUp = isTwoFaSetUp;
    this.email = email;
  }
}
