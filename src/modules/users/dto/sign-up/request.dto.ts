import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  password: string;
}
