import { IsString, IsOptional } from 'class-validator';

export class UploadFileDto {
  @IsString()
  name: string;

  @IsString()
  base64File: string;

  @IsOptional()
  @IsString()
  description?: string;
}
