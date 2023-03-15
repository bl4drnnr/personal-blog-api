import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
