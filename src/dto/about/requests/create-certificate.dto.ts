import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  name: string;

  @IsString()
  issuedDate: string;

  @IsOptional()
  @IsString()
  expirationDate?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
