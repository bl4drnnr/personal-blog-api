interface UserInfoResponse {
  firstName: string;
  lastName: string;
  email: string;
}

export class GetUserInfoResponseDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;

  constructor({ firstName, lastName, email }: UserInfoResponse) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}
