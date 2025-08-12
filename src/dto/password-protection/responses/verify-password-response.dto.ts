export class VerifyPasswordResponseDto {
  accessToken: string;
  expiresIn: number;

  constructor(data: { accessToken: string; expiresIn: number }) {
    this.accessToken = data.accessToken;
    this.expiresIn = data.expiresIn;
  }
}
