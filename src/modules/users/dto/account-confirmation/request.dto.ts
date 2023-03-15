import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AccountConfirmationRequest {
  @IsString()
  @IsNotEmpty()
  @Length(6, 32)
  password: string;
}
