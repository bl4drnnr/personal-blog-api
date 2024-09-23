interface UserInfoResponse {
  userIdHash: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class GetUserInfoResponseDto {
  readonly userIdHash: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;

  constructor({
    userIdHash,
    firstName,
    lastName,
    email
  }: UserInfoResponse) {
    this.userIdHash = userIdHash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}
